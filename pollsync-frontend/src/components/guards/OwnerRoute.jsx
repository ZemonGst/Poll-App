import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../../hooks/useAuth';
import Spinner from '../ui/Spinner';

export default function OwnerRoute() {
  const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth();
  // Read poll state
  const { currentPoll, isLoading: isPollLoading } = useSelector((state) => state.poll || {});

  // Wait if either auth or poll is loading
  if (isAuthLoading || isPollLoading) {
    return <Spinner variant="fullpage" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Normalize IDs (handling both id and _id from MongoDB)
  const currentUserId = user?.id || user?._id;
  const pollOwnerId = currentPoll?.createdBy?.id || currentPoll?.createdBy?._id || currentPoll?.createdBy;

  // Check if currentPoll exists and createdBy matches user.id
  // We only show Access Denied if the poll is loaded and IDs don't match
  if (currentPoll && pollOwnerId && pollOwnerId !== currentUserId) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="glass-panel p-8 rounded-xl text-center max-w-md">
          <span className="material-symbols-outlined text-error text-5xl mb-4">lock</span>
          <h2 className="font-sora text-2xl mb-2 text-on-surface">Access Denied</h2>
          <p className="font-hanken-grotesk text-on-surface-variant">
            You do not have permission to view this page. Only the poll owner can access analytics.
          </p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
