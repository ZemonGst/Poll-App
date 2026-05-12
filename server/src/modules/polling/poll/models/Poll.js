import mongoose from "mongoose";

const pollOptionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },

    voteCount: {
      type: Number,
      default: 0,
    },

    voters: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: null,
        },

        sessionId: {
          type: String,
          default: null,
        },

        votedAt: {
          type: Date,
          default: Date.now,
        },

        isAnonymous: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { _id: true }
);

const pollSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    shareCode: {
      type: String,
      unique: true,
      uppercase: true,
      index: true,
      sparse: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    options: {
      type: [pollOptionSchema],

      validate: {
        validator: (value) =>
          value.length >= 2,

        message:
          "Poll must contain at least 2 options",
      },
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    totalVotes: {
      type: Number,
      default: 0,
    },

    visibility: {
      type: String,

      enum: [
        "public",
        "private",
      ],

      default: "public",
    },

    pollType: {
      type: String,

      enum: [
        "single-choice",
        "multiple-choice",
      ],

      default: "single-choice",
    },

    status: {
      type: String,

      enum: [
        "active",
        "expired",
        "draft",
        "ended",
      ],

      default: "active",
    },

    allowAnonymousVotes: {
      type: Boolean,
      default: false,
    },

    allowMultipleVotes: {
      type: Boolean,
      default: false,
    },

    showLeaderboard: {
      type: Boolean,
      default: false,
    },

    showAdvancedAnalytics: {
      type: Boolean,
      default: false,
    },

    leaderboardLimit: {
      type: Number,
      default: 10,
    },

    timerDuration: {
      type: Number,
      default: 1,
    },

    expiresAt: {
      type: Date,
      default: null,
    },

    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    analytics: {
      views: {
        type: Number,
        default: 0,
      },

      shares: {
        type: Number,
        default: 0,
      },

      uniqueParticipants: {
        type: Number,
        default: 0,
      },

      authenticatedVotes: {
        type: Number,
        default: 0,
      },

      anonymousVotes: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

pollSchema.index({
  createdBy: 1,
  createdAt: -1,
});

pollSchema.index({
  status: 1,
});

pollSchema.index({
  expiresAt: 1,
});

const Poll = mongoose.model(
  "Poll",
  pollSchema
);

export default Poll;
