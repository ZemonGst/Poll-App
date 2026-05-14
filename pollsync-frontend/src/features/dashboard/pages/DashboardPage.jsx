import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyPolls, updatePollVotes, updatePollAnalytics, removePoll, markPollEnded } from '../dashboardSlice';
import { dashboardApi } from '../dashboardApi';
import { getSocket, SOCKET_EVENTS } from '../../../services/socket';
import Button from '../../../components/ui/Button';
import DataPill from '../../../components/ui/DataPill';
import Modal from '../../../components/ui/Modal';
import QRCodeCard from '../../../components/ui/QRCodeCard';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { polls, isLoading, error } = useSelector((state) => state.dashboard);

  const [shareModal, setShareModal] = useState({ isOpen: false, poll: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, poll: null, isDeleting: false });
  const [endModal, setEndModal] = useState({ isOpen: false, poll: null, isEnding: false });

  // 1. Fetch polls on mount
  useEffect(() => {
    dispatch(fetchMyPolls());
  }, [dispatch]);

  // 2. Realtime socket connection
  const activePollIds = useMemo(() => {
    return polls?.filter(p => p.status === 'active').map(p => p.id || p._id).sort().join(',') || '';
  }, [polls]);

  useEffect(() => {
    const socket = getSocket();
    socket.connect();

    const ids = activePollIds ? activePollIds.split(',') : [];

    ids.forEach(pollId => {
      socket.emit(SOCKET_EVENTS.JOIN_POLL, { pollId });
    });

    const handleVoteUpdate = (data) => {
      dispatch(updatePollVotes(data));
    };

    const handlePollEnded = (data) => {
      dispatch(markPollEnded(data));
    };

    const handleAnalyticsUpdate = (data) => {
      dispatch(updatePollAnalytics(data));
    };

    socket.on(SOCKET_EVENTS.VOTE_UPDATE, handleVoteUpdate);
    socket.on(SOCKET_EVENTS.POLL_ENDED, handlePollEnded);
    socket.on(SOCKET_EVENTS.ANALYTICS_UPDATE, handleAnalyticsUpdate);

    return () => {
      socket.off(SOCKET_EVENTS.VOTE_UPDATE, handleVoteUpdate);
      socket.off(SOCKET_EVENTS.POLL_ENDED, handlePollEnded);
      socket.off(SOCKET_EVENTS.ANALYTICS_UPDATE, handleAnalyticsUpdate);
      ids.forEach(pollId => {
        socket.emit(SOCKET_EVENTS.LEAVE_POLL, { pollId });
      });
    };
  }, [activePollIds, dispatch]);

  const pollsArray = Array.isArray(polls) ? polls : [];
  const totalPolls = pollsArray.length;
  const activePollsCount = pollsArray.filter(p => p.status === 'active').length;
  const totalVotes = pollsArray.reduce((sum, p) => sum + (p.totalVotes || 0), 0);

  const handleEndPoll = async () => {
    const pollId = endModal.poll._id || endModal.poll.id;
    setEndModal(prev => ({ ...prev, isEnding: true }));
    try {
      await dashboardApi.endPoll(pollId);
      dispatch(markPollEnded(pollId));
      setEndModal({ isOpen: false, poll: null, isEnding: false });
    } catch (err) {
      console.error('Failed to end poll', err);
      setEndModal(prev => ({ ...prev, isEnding: false }));
    }
  };

  const handleDeletePoll = async () => {
    const pollId = deleteModal.poll._id || deleteModal.poll.id;
    setDeleteModal(prev => ({ ...prev, isDeleting: true }));
    try {
      await dashboardApi.deletePoll(pollId);
      dispatch(removePoll(pollId));
      setDeleteModal({ isOpen: false, poll: null, isDeleting: false });
    } catch (err) {
      console.error('Failed to delete poll', err);
      setDeleteModal(prev => ({ ...prev, isDeleting: false }));
    }
  };

  const getShareUrl = (shareCode) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/share/${shareCode}`;
  };

  const renderStatusPill = (status) => {
    switch (status) {
      case 'active':
        return (
          <span className="flex items-center gap-1.5 bg-tertiary/10 text-tertiary font-label-caps text-label-caps px-3 py-1 rounded-full border border-tertiary/20 shadow-[0_0_15px_rgba(183,207,135,0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary" />
            </span>
            ACTIVE
          </span>
        );
      case 'ended':
        return (
          <span className="bg-surface-container text-on-surface-variant font-label-caps text-label-caps px-3 py-1 rounded-full border border-outline-variant/30 inline-flex items-center">
            ENDED
          </span>
        );
      case 'draft':
      default:
        return (
          <span className="bg-transparent text-outline font-label-caps text-label-caps px-3 py-1 rounded-full border border-outline/50 inline-flex items-center">
            DRAFT
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-10 py-8 relative z-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="font-sora text-3xl font-bold text-on-surface">Your Polls</h1>
        <Button variant="primary" icon="add_circle" onClick={() => navigate('/poll/create')}>
          Create Poll
        </Button>
      </div>

      {/* Stats Row */}
      <div className="flex flex-wrap gap-4 mb-10">
        <DataPill icon="bar_chart">Total Polls · {totalPolls}</DataPill>
        <DataPill icon="bolt">Active Now · {activePollsCount}</DataPill>
        <DataPill icon="how_to_vote">Total Votes · {totalVotes}</DataPill>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="glass-panel rounded-xl p-6 h-48 animate-pulse">
              <div className="h-6 bg-surface-bright rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-surface-bright rounded w-1/4 mb-8"></div>
              <div className="h-10 bg-surface-bright rounded mt-auto"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="glass-panel rounded-xl p-8 text-center mt-8">
          <h2 className="font-sora text-xl font-semibold text-error mb-2">Unable to load polls</h2>
          <p className="font-hanken-grotesk text-on-surface-variant mb-6">{error}</p>
          <Button variant="ghost" icon="refresh" onClick={() => dispatch(fetchMyPolls())}>
            Try Again
          </Button>
        </div>
      ) : pollsArray.length === 0 ? (
        <div className="glass-panel rounded-xl p-12 flex flex-col items-center justify-center text-center mt-8">
          <span className="material-symbols-outlined text-6xl text-outline-variant mb-4" style={{ fontVariationSettings: "'FILL' 0" }}>
            inbox
          </span>
          <h2 className="font-sora text-xl font-semibold text-on-surface mb-2">No polls yet</h2>
          <p className="font-hanken-grotesk text-on-surface-variant mb-6 max-w-md">
            You haven't created any polls yet. Start engaging with your audience by creating your first realtime poll.
          </p>
          <Button variant="primary" icon="add_circle" onClick={() => navigate('/poll/create')} size="lg">
            Create Your First Poll
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pollsArray.map((poll) => {
            const pollId = poll.id || poll._id;
            const pollTitle = poll.title || poll.question || 'Untitled poll';
            return (
              <div key={pollId} className="glass-panel rounded-xl p-6 flex flex-col hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 min-h-[220px]">
                <div className="flex justify-between items-start mb-4">
                  {renderStatusPill(poll.status)}
                  <span className="font-jetbrains-mono text-xs text-on-surface-variant">
                    {poll.createdAt ? new Date(poll.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>
                
                <h3 className="font-sora text-xl font-semibold text-on-surface mb-6 line-clamp-2">
                  {pollTitle}
                </h3>

                <div className="mt-auto flex flex-col gap-5">
                  <div className="flex items-center gap-2 font-jetbrains-mono text-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px]">how_to_vote</span>
                    {poll.totalVotes || 0} Votes
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4 border-t border-outline-variant/20">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      icon="share" 
                      onClick={() => setShareModal({ isOpen: true, poll })}
                      className="flex-1"
                    >
                      Share
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      icon="analytics" 
                      onClick={() => navigate(`/poll/${pollId}/analytics`)}
                      className="flex-1"
                    >
                      Analytics
                    </Button>
                    {poll.status === 'active' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        icon="stream" 
                        onClick={() => navigate(`/poll/${pollId}/live`)}
                        className="flex-1"
                      >
                        Live
                      </Button>
                    )}
                    {poll.status === 'active' && (
                      <Button 
                        variant="danger" 
                        size="sm" 
                        icon="stop_circle" 
                        title="End Poll"
                        onClick={() => setEndModal({ isOpen: true, poll })}
                      >
                      </Button>
                    )}
                    <Button 
                      variant="danger" 
                      size="sm" 
                      icon="delete" 
                      title="Delete Poll"
                      onClick={() => setDeleteModal({ isOpen: true, poll })}
                    >
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <Modal 
        isOpen={shareModal.isOpen} 
        onClose={() => setShareModal({ isOpen: false, poll: null })}
        title="Share Poll"
      >
        {shareModal.poll && (
          <QRCodeCard 
            url={getShareUrl(shareModal.poll.shareCode)} 
            shareCode={shareModal.poll.shareCode} 
          />
        )}
      </Modal>

      <Modal 
        isOpen={endModal.isOpen} 
        onClose={() => !endModal.isEnding && setEndModal({ isOpen: false, poll: null })}
        title="End Poll"
      >
        <p className="font-hanken-grotesk text-on-surface-variant mb-6">
          Are you sure you want to end "{endModal.poll?.title || endModal.poll?.question}"? This will stop all new votes from being cast.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setEndModal({ isOpen: false, poll: null })} disabled={endModal.isEnding}>
            Cancel
          </Button>
          <Button variant="danger" icon="stop_circle" onClick={handleEndPoll} loading={endModal.isEnding}>
            End Poll
          </Button>
        </div>
      </Modal>

      <Modal 
        isOpen={deleteModal.isOpen} 
        onClose={() => !deleteModal.isDeleting && setDeleteModal({ isOpen: false, poll: null })}
        title="Delete Poll"
      >
        <p className="font-hanken-grotesk text-on-surface-variant mb-6">
          Are you sure you want to delete "{deleteModal.poll?.title || deleteModal.poll?.question}"? This action cannot be undone and all data will be permanently lost.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteModal({ isOpen: false, poll: null })} disabled={deleteModal.isDeleting}>
            Cancel
          </Button>
          <Button variant="danger" icon="delete" onClick={handleDeletePoll} loading={deleteModal.isDeleting}>
            Delete Poll
          </Button>
        </div>
      </Modal>
    </div>
  );
}
