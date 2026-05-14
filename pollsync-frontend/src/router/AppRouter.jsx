import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import ProtectedRoute from '../components/guards/ProtectedRoute';
import OwnerRoute from '../components/guards/OwnerRoute';
import Spinner from '../components/ui/Spinner';

// Pages — lazy loaded
const AuthPage         = lazy(() => import('../features/auth/pages/AuthPage'));
const AuthCallbackPage = lazy(() => import('../features/auth/pages/AuthCallbackPage'));
const DashboardPage    = lazy(() => import('../features/dashboard/pages/DashboardPage'));
const CreatePollPage   = lazy(() => import('../features/polls/pages/CreatePollPage'));
const PollBoothPage    = lazy(() => import('../features/polls/pages/PollBoothPage'));
const ResultsPage      = lazy(() => import('../features/results/pages/ResultsPage'));
const LeaderboardPage  = lazy(() => import('../features/leaderboard/pages/LeaderboardPage'));
const AnalyticsPage    = lazy(() => import('../features/analytics/pages/AnalyticsPage'));
const SharePage        = lazy(() => import('../features/share/pages/SharePage'));
const LiveDashboardPage = lazy(() => import('../features/dashboard/pages/LiveDashboardPage'));

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Spinner variant="fullpage" />}>
        <Routes>
          {/* ── Public Routes ──────────────────────────────── */}
          <Route path="/"                          element={<AuthPage />} />
          <Route path="/auth/callback"             element={<AuthCallbackPage />} />
          <Route path="/poll/:pollId"              element={<PollBoothPage />} />
          <Route path="/poll/:pollId/results"      element={<ResultsPage />} />
          <Route path="/poll/:pollId/leaderboard"  element={<LeaderboardPage />} />
          {/* Share redirect — public, no auth required */}
          <Route path="/share/:shareCode"          element={<SharePage />} />

          {/* ── Protected: Auth Required ───────────────────── */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard"    element={<DashboardPage />} />
              <Route path="/poll/create"  element={<CreatePollPage />} />

              {/* ── Protected: Owner Only ─────────────────── */}
              <Route element={<OwnerRoute />}>
                <Route path="/poll/:pollId/analytics" element={<AnalyticsPage />} />
                <Route path="/poll/:pollId/live"      element={<LiveDashboardPage />} />
              </Route>
            </Route>
          </Route>

          {/* ── Catch-all ─────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
