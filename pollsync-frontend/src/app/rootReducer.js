import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import pollReducer from '../features/polls/pollSlice';
import resultsReducer from '../features/results/resultsSlice';
import analyticsReducer from '../features/analytics/analyticsSlice';
import leaderboardReducer from '../features/leaderboard/leaderboardSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  poll: pollReducer,
  results: resultsReducer,
  analytics: analyticsReducer,
  leaderboard: leaderboardReducer,
});

export default rootReducer;
