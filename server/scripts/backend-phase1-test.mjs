import "dotenv/config";

import assert from "node:assert/strict";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { io as createSocketClient } from "socket.io-client";

import Poll from "../src/modules/polling/poll/models/Poll.js";
import User from "../src/modules/auth/models/User.js";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:8000";
const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const testEmails = [
  `phase1-owner-${suffix}@example.com`,
  `phase1-other-${suffix}@example.com`,
];
const createdPollIds = new Set();
const createdUserIds = new Set();
const failures = [];
const passes = [];

const record = async (name, fn) => {
  try {
    await fn();
    passes.push(name);
    console.log(`PASS ${name}`);
  } catch (error) {
    failures.push({ name, error });
    console.error(`FAIL ${name}: ${error.message}`);
  }
};

const expectStatus = (response, status, label) => {
  assert.equal(
    response.status,
    status,
    `${label} expected HTTP ${status}, got ${response.status}: ${JSON.stringify(response.body)}`
  );
};

const request = async (method, path, { token, body, cookie } = {}) => {
  const headers = {
    Accept: "application/json",
  };

  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;
  if (cookie) headers.Cookie = cookie;

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const setCookie =
    typeof response.headers.getSetCookie === "function"
      ? response.headers.getSetCookie()[0]
      : response.headers.get("set-cookie");
  const text = await response.text();
  let parsed = text;

  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    // Health check returns text.
  }

  return {
    status: response.status,
    body: parsed,
    cookie: setCookie?.split(";")[0],
  };
};

const assertNoSensitiveKeys = (value, context) => {
  const blocked = new Set(["voters", "sessionId", "userId", "password", "__v"]);

  const visit = (node, path = context) => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      node.forEach((item, index) => visit(item, `${path}[${index}]`));
      return;
    }

    for (const [key, child] of Object.entries(node)) {
      assert.equal(blocked.has(key), false, `${path} exposes sensitive key "${key}"`);
      visit(child, `${path}.${key}`);
    }
  };

  visit(value);
};

const waitForSocketEvent = (socket, event, action, timeoutMs = 4000) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      socket.off(event, handler);
      reject(new Error(`Timed out waiting for socket event "${event}"`));
    }, timeoutMs);

    const handler = (payload) => {
      clearTimeout(timer);
      socket.off(event, handler);
      resolve(payload);
    };

    socket.on(event, handler);
    Promise.resolve(action()).catch((error) => {
      clearTimeout(timer);
      socket.off(event, handler);
      reject(error);
    });
  });

const waitForSocketEvents = (socket, events, action, timeoutMs = 4000) =>
  new Promise((resolve, reject) => {
    const received = {};
    const handlers = {};

    const cleanup = () => {
      clearTimeout(timer);
      events.forEach((event) => socket.off(event, handlers[event]));
    };

    const timer = setTimeout(() => {
      cleanup();
      const missing = events.filter((event) => !(event in received));
      reject(new Error(`Timed out waiting for socket events: ${missing.join(", ")}`));
    }, timeoutMs);

    events.forEach((event) => {
      handlers[event] = (payload) => {
        received[event] = payload;
        if (events.every((item) => item in received)) {
          cleanup();
          resolve(received);
        }
      };
      socket.on(event, handlers[event]);
    });

    Promise.resolve(action()).catch((error) => {
      cleanup();
      reject(error);
    });
  });

const connectSocket = (pollId) =>
  new Promise((resolve, reject) => {
    const socket = createSocketClient(BASE_URL, {
      transports: ["websocket"],
      withCredentials: true,
      timeout: 4000,
    });

    const timer = setTimeout(() => {
      socket.close();
      reject(new Error("Socket connection timed out"));
    }, 4000);

    socket.on("connect", () => {
      clearTimeout(timer);
      socket.emit("join-poll", { pollId });
      resolve(socket);
    });

    socket.on("connect_error", (error) => {
      clearTimeout(timer);
      socket.close();
      reject(error);
    });
  });

const pollPayload = (overrides = {}) => ({
  title: `Phase 1 backend poll ${suffix}`,
  description: "Backend integration test poll",
  options: [{ text: "Alpha" }, { text: "Beta" }],
  visibility: "public",
  pollType: "single-choice",
  allowAnonymousVotes: true,
  allowMultipleVotes: false,
  showLeaderboard: true,
  showAdvancedAnalytics: true,
  leaderboardLimit: 10,
  timerDuration: 30,
  tags: ["phase1", "backend"],
  ...overrides,
});

let ownerToken;
let otherToken;
let ownerId;
let otherId;
let pollId;
let optionA;
let optionB;
let anonymousCookie;

try {
  await mongoose.connect(process.env.MONGO_URI);

  await record("health check", async () => {
    const response = await request("GET", "/");
    expectStatus(response, 200, "health check");
    assert.equal(response.body, "Server is running");
  });

  await record("register owner and second user", async () => {
    const owner = await request("POST", "/api/auth/register", {
      body: { name: "Phase Owner", email: testEmails[0], password: "secret123" },
    });
    expectStatus(owner, 201, "register owner");
    assertNoSensitiveKeys(owner.body, "register owner response");
    ownerId = String(owner.body.data.id);
    createdUserIds.add(ownerId);

    const other = await request("POST", "/api/auth/register", {
      body: { name: "Phase Other", email: testEmails[1], password: "secret123" },
    });
    expectStatus(other, 201, "register other");
    otherId = String(other.body.data.id);
    createdUserIds.add(otherId);
  });

  await record("auth login/me/invalid token/expired token", async () => {
    const login = await request("POST", "/api/auth/login", {
      body: { email: testEmails[0], password: "secret123" },
    });
    expectStatus(login, 200, "login owner");
    ownerToken = login.body.data.token;
    assert.ok(ownerToken, "login returns token");
    assertNoSensitiveKeys(login.body, "login response");

    const otherLogin = await request("POST", "/api/auth/login", {
      body: { email: testEmails[1], password: "secret123" },
    });
    expectStatus(otherLogin, 200, "login other");
    otherToken = otherLogin.body.data.token;

    expectStatus(await request("GET", "/api/auth/me"), 401, "me without token");
    expectStatus(await request("GET", "/api/auth/me", { token: "bad-token" }), 401, "me invalid token");

    const expiredToken = jwt.sign({ id: ownerId }, process.env.JWT_SECRET, { expiresIn: "-1s" });
    expectStatus(await request("GET", "/api/auth/me", { token: expiredToken }), 401, "me expired token");

    const me = await request("GET", "/api/auth/me", { token: ownerToken });
    expectStatus(me, 200, "me valid token");
    assert.equal(String(me.body.data.id), ownerId);
  });

  await record("anonymous users cannot create polls", async () => {
    expectStatus(await request("POST", "/api/polls", { body: pollPayload() }), 401, "anonymous create poll");
  });

  await record("create poll validation", async () => {
    expectStatus(
      await request("POST", "/api/polls", {
        token: ownerToken,
        body: pollPayload({ title: undefined }),
      }),
      422,
      "missing title validation"
    );

    expectStatus(
      await request("POST", "/api/polls", {
        token: ownerToken,
        body: pollPayload({ options: [{ text: "Only one" }] }),
      }),
      422,
      "minimum options validation"
    );

    expectStatus(
      await request("POST", "/api/polls", {
        token: ownerToken,
        body: pollPayload({ timerDuration: 999 }),
      }),
      422,
      "timer validation"
    );
  });

  await record("create poll saves DTO-safe data and MongoDB state", async () => {
    const created = await request("POST", "/api/polls", {
      token: ownerToken,
      body: pollPayload(),
    });
    expectStatus(created, 201, "create poll");
    assertNoSensitiveKeys(created.body.data.options, "create poll options");
    pollId = String(created.body.data.id);
    optionA = String(created.body.data.options[0].id);
    optionB = String(created.body.data.options[1].id);
    createdPollIds.add(pollId);
    assert.ok(created.body.data.shareCode, "share code generated");
    assert.ok(created.body.data.expiresAt, "expiresAt generated");

    const stored = await Poll.findById(pollId);
    assert.ok(stored, "poll persisted in MongoDB");
    assert.equal(String(stored.createdBy), ownerId);
    assert.equal(stored.options.length, 2);
  });

  await record("get poll and my polls ownership filtering", async () => {
    const publicPoll = await request("GET", `/api/polls/${pollId}`);
    expectStatus(publicPoll, 200, "get poll");
    assertNoSensitiveKeys(publicPoll.body.data.options, "get poll options");

    const mine = await request("GET", "/api/polls/me", { token: ownerToken });
    expectStatus(mine, 200, "owner my polls");
    assert.ok(mine.body.data.some((poll) => String(poll.id) === pollId), "owner sees created poll");

    const otherMine = await request("GET", "/api/polls/me", { token: otherToken });
    expectStatus(otherMine, 200, "other my polls");
    assert.equal(otherMine.body.data.some((poll) => String(poll.id) === pollId), false);
  });

  await record("share route increments shares and stays DTO-safe", async () => {
    const before = await Poll.findById(pollId);
    const shared = await request("GET", `/api/share/${before.shareCode.toLowerCase()}`);
    expectStatus(shared, 200, "share lookup");
    assert.equal(String(shared.body.data.id), pollId);
    assertNoSensitiveKeys(shared.body.data.options, "share options");

    const after = await Poll.findById(pollId);
    assert.equal(after.analytics.shares, before.analytics.shares + 1);
  });

  await record("update poll owner-only and allowed fields", async () => {
    expectStatus(
      await request("PATCH", `/api/polls/${pollId}`, {
        token: otherToken,
        body: { title: "Other update denied" },
      }),
      401,
      "non-owner update"
    );

    expectStatus(
      await request("PATCH", `/api/polls/${pollId}`, {
        token: ownerToken,
        body: {
          createdBy: otherId,
        },
      }),
      422,
      "unsafe createdBy patch rejected"
    );

    let stored = await Poll.findById(pollId);
    assert.equal(String(stored.createdBy), ownerId, "unsafe createdBy patch did not mutate owner");

    const updated = await request("PATCH", `/api/polls/${pollId}`, {
      token: ownerToken,
      body: {
        title: "Updated Phase 1 Poll",
        description: "Updated description",
        showLeaderboard: true,
        showAdvancedAnalytics: true,
        leaderboardLimit: 5,
        timerDuration: 60,
      },
    });
    expectStatus(updated, 200, "owner update");
    assert.equal(updated.body.data.title, "Updated Phase 1 Poll");
    assert.equal(updated.body.data.leaderboardLimit, 5);

    stored = await Poll.findById(pollId);
    assert.equal(String(stored.createdBy), ownerId, "unsafe createdBy patch ignored");
  });

  await record("socket join and vote broadcasts after MongoDB update", async () => {
    const socket = await connectSocket(pollId);
    try {
      const firstVotePayloads = await waitForSocketEvents(
        socket,
        ["vote-update", "analytics-update", "leaderboard-update"],
        async () => {
        const vote = await request("POST", `/api/polls/${pollId}/vote`, {
          token: ownerToken,
          body: { optionId: optionA },
        });
        expectStatus(vote, 200, "authenticated vote");
      });
      const votePayload = firstVotePayloads["vote-update"];
      assert.equal(String(votePayload.id), pollId);
      assert.equal(votePayload.totalVotes, 1);
      assertNoSensitiveKeys(votePayload, "vote-update payload");
      assert.equal(firstVotePayloads["leaderboard-update"].leaderboard.length, 1);

      const stored = await Poll.findById(pollId);
      assert.equal(stored.totalVotes, 1, "MongoDB totalVotes updated before verification");
      assert.equal(stored.analytics.authenticatedVotes, 1);

      const realtimePayloads = await waitForSocketEvents(socket, ["analytics-update", "leaderboard-update"], async () => {
        if (!anonymousCookie) {
          const sessionSeed = await request("GET", "/");
          anonymousCookie = sessionSeed.cookie;
        }

        const anon = await request("POST", `/api/polls/${pollId}/vote`, {
          cookie: anonymousCookie,
          body: { optionId: optionB },
        });
        anonymousCookie = anon.cookie || anonymousCookie;
        expectStatus(anon, 200, "anonymous vote");
      });
      const analyticsPayload = realtimePayloads["analytics-update"];
      assert.equal(analyticsPayload.totalVotes, 2);
      assert.equal(analyticsPayload.anonymousVotes, 1);
      assertNoSensitiveKeys(analyticsPayload, "analytics-update payload");

      const leaderboardPayload = realtimePayloads["leaderboard-update"];
      assert.equal(String(leaderboardPayload.id), pollId);
      assert.equal(leaderboardPayload.leaderboard.length, 2);
      assertNoSensitiveKeys(leaderboardPayload, "leaderboard-update payload");
    } finally {
      socket.emit("leave-poll", { pollId });
      socket.close();
    }
  });

  await record("duplicate anonymous and authenticated vote prevention", async () => {
    expectStatus(
      await request("POST", `/api/polls/${pollId}/vote`, {
        token: ownerToken,
        body: { optionId: optionB },
      }),
      400,
      "duplicate authenticated vote"
    );

    expectStatus(
      await request("POST", `/api/polls/${pollId}/vote`, {
        cookie: anonymousCookie,
        body: { optionId: optionA },
      }),
      400,
      "duplicate anonymous vote"
    );
  });

  await record("results, analytics, leaderboard route rules", async () => {
    const activeAnonResults = await request("GET", `/api/polls/${pollId}/results`);
    expectStatus(activeAnonResults, 200, "active anonymous results");
    assert.equal("totalVotes" in activeAnonResults.body.data, false, "active anonymous results hide totalVotes");
    assert.equal("voteCount" in activeAnonResults.body.data.options[0], false, "active anonymous results hide voteCount");

    const ownerResults = await request("GET", `/api/polls/${pollId}/results`, { token: ownerToken });
    expectStatus(ownerResults, 200, "owner active results");
    assert.equal(ownerResults.body.data.totalVotes, 2);

    expectStatus(await request("GET", `/api/polls/${pollId}/analytics`), 401, "anonymous analytics denied");
    expectStatus(await request("GET", `/api/polls/${pollId}/analytics`, { token: otherToken }), 401, "non-owner analytics denied");

    const analytics = await request("GET", `/api/polls/${pollId}/analytics`, { token: ownerToken });
    expectStatus(analytics, 200, "owner analytics");
    assert.equal(analytics.body.data.analytics.authenticatedVotes, 1);
    assert.equal(analytics.body.data.analytics.anonymousVotes, 1);

    const leaderboard = await request("GET", `/api/polls/${pollId}/leaderboard`);
    expectStatus(leaderboard, 200, "leaderboard");
    assert.equal(leaderboard.body.data.leaderboard.length, 2);
    assertNoSensitiveKeys(leaderboard.body.data, "leaderboard payload");
  });

  await record("manual end emits poll-ended and unlocks public results", async () => {
    const socket = await connectSocket(pollId);
    try {
      const endedPayload = await waitForSocketEvent(socket, "poll-ended", async () => {
        const ended = await request("PATCH", `/api/polls/${pollId}/end`, { token: ownerToken });
        expectStatus(ended, 200, "manual end");
      });
      assert.equal(String(endedPayload.id), pollId);
      assert.equal(endedPayload.status, "ended");
      assertNoSensitiveKeys(endedPayload, "poll-ended payload");
    } finally {
      socket.emit("leave-poll", { pollId });
      socket.close();
    }

    const publicResults = await request("GET", `/api/polls/${pollId}/results`);
    expectStatus(publicResults, 200, "ended public results");
    assert.equal(publicResults.body.data.totalVotes, 2);
    assert.equal(typeof publicResults.body.data.options[0].voteCount, "number");
  });

  await record("ended polls reject late votes", async () => {
    expectStatus(
      await request("POST", `/api/polls/${pollId}/vote`, {
        body: { optionId: optionA },
      }),
      400,
      "late vote"
    );
  });

  await record("automatic timer expiration emits poll-ended", async () => {
    const expiresAt = new Date(Date.now() + 1500).toISOString();
    const created = await request("POST", "/api/polls", {
      token: ownerToken,
      body: pollPayload({
        title: `Phase 1 auto-expire ${suffix}`,
        expiresAt,
        timerDuration: 30,
      }),
    });
    expectStatus(created, 201, "create expiring poll");
    const expiringPollId = String(created.body.data.id);
    createdPollIds.add(expiringPollId);

    const timer = await request("GET", `/api/polls/${expiringPollId}/timer`);
    expectStatus(timer, 200, "timer route");
    assert.ok(timer.body.data.expiresAt, "timer exposes expiresAt");

    const socket = await connectSocket(expiringPollId);
    try {
      const endedPayload = await waitForSocketEvent(socket, "poll-ended", async () => {}, 14000);
      assert.equal(String(endedPayload.id), expiringPollId);
      assert.equal(endedPayload.status, "ended");
    } finally {
      socket.emit("leave-poll", { pollId: expiringPollId });
      socket.close();
    }

    const stored = await Poll.findById(expiringPollId);
    assert.equal(stored.status, "ended");
  });

  await record("delete poll owner-only and removes MongoDB document", async () => {
    const created = await request("POST", "/api/polls", {
      token: ownerToken,
      body: pollPayload({ title: `Phase 1 delete ${suffix}` }),
    });
    expectStatus(created, 201, "create delete poll");
    const deletePollId = String(created.body.data.id);
    createdPollIds.add(deletePollId);

    expectStatus(await request("DELETE", `/api/polls/${deletePollId}`, { token: otherToken }), 401, "non-owner delete");
    expectStatus(await request("DELETE", `/api/polls/${deletePollId}`, { token: ownerToken }), 200, "owner delete");

    const stored = await Poll.findById(deletePollId);
    assert.equal(stored, null);
    createdPollIds.delete(deletePollId);
  });
} finally {
  await Poll.deleteMany({ _id: { $in: [...createdPollIds] } });
  await User.deleteMany({ _id: { $in: [...createdUserIds] } });
  await mongoose.disconnect();
}

console.log("\nBackend Phase 1 Summary");
console.log(`Passed: ${passes.length}`);
console.log(`Failed: ${failures.length}`);

if (failures.length > 0) {
  failures.forEach(({ name, error }) => {
    console.log(`- ${name}: ${error.message}`);
  });
  process.exitCode = 1;
}
