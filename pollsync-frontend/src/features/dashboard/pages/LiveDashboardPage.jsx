import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getSocket, SOCKET_EVENTS } from '../../../services/socket';
import { getPollById, endPoll as endPollApi } from '../../polls/pollApi';
import { getPollAnalytics } from '../../analytics/analyticsApi';
import { getPollLeaderboard } from '../../leaderboard/leaderboardApi';
import PageBackground from '../../../components/layout/PageBackground';
import Spinner from '../../../components/ui/Spinner';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import DataPill from '../../../components/ui/DataPill';
import LiveBadge from '../../../components/ui/LiveBadge';
import VoteBar from '../../../components/ui/VoteBar';
import Modal from '../../../components/ui/Modal';
import QRCodeCard from '../../../components/ui/QRCodeCard';

export default function LiveDashboardPage() {
  const { pollId } = useParams();
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const { user } = useSelector((state) => state.auth);

  const [poll, setPoll] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activity, setActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [endModal, setEndModal] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const activityIdRef = useRef(0);

  // Initial data load
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const [pollRes, analyticsRes, leaderboardRes] = await Promise.allSettled([
          getPollById(pollId),
          getPollAnalytics(pollId),
          getPollLeaderboard(pollId),
        ]);

        if (cancelled) return;

        if (pollRes.status === 'fulfilled') {
          const pollData = pollRes.value?.data || pollRes.value;
          setPoll(pollData);
        } else {
          setError('Failed to load poll');
          setIsLoading(false);
          return;
        }

        if (analyticsRes.status === 'fulfilled') {
          const analyticsData = analyticsRes.value?.data || analyticsRes.value;
          setAnalytics(analyticsData);
        }

        if (leaderboardRes.status === 'fulfilled') {
          const lbData = leaderboardRes.value?.data || leaderboardRes.value;
          const rankings = lbData?.leaderboard || lbData?.rankings || lbData?.topVoters || [];
          setLeaderboard(rankings);
        }

        setIsLoading(false);
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || 'Failed to load dashboard');
          setIsLoading(false);
        }
      }
    }

    loadData();
    return () => { cancelled = true; };
  }, [pollId]);

  // Socket.IO real-time connection
  useEffect(() => {
    if (!pollId) return;

    const socket = getSocket();
    if (!socket.connected) {
      socket.connect();
    }
    socket.emit(SOCKET_EVENTS.JOIN_POLL, { pollId });

    const handleVoteUpdate = (data) => {
      const incoming = data?.poll || data;
      if (incoming && (incoming.id === pollId || incoming.pollId === pollId || incoming._id === pollId || data?.pollId === pollId)) {
        setPoll(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            options: incoming.options || prev.options,
            totalVotes: incoming.totalVotes ?? prev.totalVotes,
            status: incoming.status || prev.status,
          };
        });

        // Add activity entry
        activityIdRef.current += 1;
        const voter = incoming.lastVoter || data?.voter || 'Someone';
        const voterName = typeof voter === 'string' ? voter : (voter?.name || voter?.participant || 'Someone');
        setActivity(prev => [
          { id: activityIdRef.current, text: `${voterName} voted`, time: new Date().toLocaleTimeString() },
          ...prev.slice(0, 19),
        ]);
      }
    };

    const handleAnalyticsUpdate = (data) => {
      if (data && (data.id === pollId || data.pollId === pollId || data._id === pollId)) {
        setAnalytics(prev => ({
          ...prev,
          ...(data.analytics || data),
        }));
      }
    };

    const handleLeaderboardUpdate = (data) => {
      if (data && (data.id === pollId || data.pollId === pollId || data._id === pollId)) {
        const rankings = data?.leaderboard || data?.rankings || data?.topVoters || [];
        if (rankings.length > 0) {
          setLeaderboard(rankings);
        }
      }
    };

    const handlePollEnded = (data) => {
      if (data && (data.id === pollId || data.pollId === pollId)) {
        setPoll(prev => prev ? { ...prev, status: 'ended' } : prev);
      }
    };

    socket.on(SOCKET_EVENTS.VOTE_UPDATE, handleVoteUpdate);
    socket.on(SOCKET_EVENTS.ANALYTICS_UPDATE, handleAnalyticsUpdate);
    socket.on(SOCKET_EVENTS.LEADERBOARD_UPDATE, handleLeaderboardUpdate);
    socket.on(SOCKET_EVENTS.POLL_ENDED, handlePollEnded);

    return () => {
      socket.emit(SOCKET_EVENTS.LEAVE_POLL, { pollId });
      socket.off(SOCKET_EVENTS.VOTE_UPDATE, handleVoteUpdate);
      socket.off(SOCKET_EVENTS.ANALYTICS_UPDATE, handleAnalyticsUpdate);
      socket.off(SOCKET_EVENTS.LEADERBOARD_UPDATE, handleLeaderboardUpdate);
      socket.off(SOCKET_EVENTS.POLL_ENDED, handlePollEnded);
    };
  }, [pollId]);

  const handleEndPoll = useCallback(async () => {
    setIsEnding(true);
    try {
      await endPollApi(pollId);
      setPoll(prev => prev ? { ...prev, status: 'ended' } : prev);
      setEndModal(false);
    } catch (err) {
      console.error('Failed to end poll', err);
    }
    setIsEnding(false);
  }, [pollId]);

  const getShareUrl = () => {
    const shareCode = poll?.shareCode;
    if (!shareCode) return '';
    return `${window.location.origin}/share/${shareCode}`;
  };

  // Loading
  if (isLoading) {
    return (
      <PageBackground>
        <Spinner variant="fullpage" />
      </PageBackground>
    );
  }

  // Error
  if (error || !poll) {
    return (
      <PageBackground>
        <div className="max-w-md mx-auto pt-20 px-5">
          <Card className="text-center p-8">
            <h2 className="text-xl text-error mb-4 font-sora">Error</h2>
            <p className="text-on-surface-variant mb-6">{error || 'Poll not found'}</p>
            <Button onClick={() => navigate('/dashboard')} variant="ghost">Go to Dashboard</Button>
          </Card>
        </div>
      </PageBackground>
    );
  }

  const isEnded = poll.status === 'ended';
  const totalVotes = poll.totalVotes || 0;
  const maxVotes = Math.max(...(poll.options?.map(o => o.voteCount || 0) || [0]));

  // Analytics data
  const authenticatedVotes = analytics?.authenticatedVotes || 0;
  const anonymousVotes = analytics?.anonymousVotes || 0;
  const uniqueParticipants = analytics?.uniqueParticipants || analytics?.totalParticipants || (authenticatedVotes + anonymousVotes);

  return (
    <PageBackground>
      <div className="max-w-7xl mx-auto pt-8 pb-20 px-5 md:px-10 relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {!isEnded && <LiveBadge />}
              {isEnded && (
                <span className="bg-surface-container text-on-surface-variant font-jetbrains-mono text-xs uppercase tracking-widest px-3 py-1 rounded-full border border-outline-variant/30 inline-flex items-center">
                  ENDED
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-sora text-on-surface font-bold">
              {poll.title || 'Untitled Poll'}
            </h1>
            {poll.description && (
              <p className="text-on-surface-variant font-hanken-grotesk mt-1 text-sm">{poll.description}</p>
            )}
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Button variant="ghost" icon="share" size="sm" onClick={() => setShareModalOpen(true)}>
              Share
            </Button>
            {!isEnded && (
              <Button variant="danger" icon="stop_circle" size="sm" onClick={() => setEndModal(true)}>
                End Poll
              </Button>
            )}
            <Button variant="ghost" icon="arrow_back" size="sm" onClick={() => navigate('/dashboard')}>
              Dashboard
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap gap-3 mb-8">
          <DataPill icon="how_to_vote">Total Votes · {totalVotes}</DataPill>
          <DataPill icon="person">{authenticatedVotes} Authenticated</DataPill>
          <DataPill icon="no_accounts">{anonymousVotes} Anonymous</DataPill>
          <DataPill icon="group">{uniqueParticipants} Participants</DataPill>
          <DataPill icon="info">{isEnded ? 'ENDED' : 'ACTIVE'}</DataPill>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Column 1: Live Vote Count */}
          <div className="lg:col-span-2">
            <Card className="p-6 md:p-8">
              <h3 className="font-jetbrains-mono text-xs uppercase tracking-[0.1em] text-on-surface-variant mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>bar_chart</span>
                Live Vote Count
              </h3>
              <div className="flex flex-col gap-5">
                {poll.options?.map((opt) => {
                  const percentage = totalVotes > 0 ? (opt.voteCount / totalVotes) * 100 : 0;
                  const isLeading = opt.voteCount > 0 && opt.voteCount === maxVotes;
                  return (
                    <VoteBar
                      key={opt.id || opt._id}
                      percentage={percentage}
                      label={opt.text}
                      votes={opt.voteCount || 0}
                      isLeading={isLeading}
                    />
                  );
                })}
                {(!poll.options || poll.options.length === 0) && (
                  <p className="text-on-surface-variant text-center py-6">No vote data yet.</p>
                )}
              </div>
            </Card>
          </div>

          {/* Column 2: Analytics + Leaderboard */}
          <div className="flex flex-col gap-6">

            {/* Live Analytics */}
            <Card className="p-6">
              <h3 className="font-jetbrains-mono text-xs uppercase tracking-[0.1em] text-on-surface-variant mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>monitoring</span>
                Live Analytics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-hanken-grotesk text-sm text-on-surface-variant">Total Votes</span>
                  <span className="font-jetbrains-mono text-lg text-on-surface font-bold">{totalVotes}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-hanken-grotesk text-sm text-on-surface-variant">Authenticated</span>
                  <span className="font-jetbrains-mono text-on-surface">{authenticatedVotes}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-hanken-grotesk text-sm text-on-surface-variant">Anonymous</span>
                  <span className="font-jetbrains-mono text-on-surface">{anonymousVotes}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-hanken-grotesk text-sm text-on-surface-variant">Unique Participants</span>
                  <span className="font-jetbrains-mono text-on-surface">{uniqueParticipants}</span>
                </div>
              </div>
            </Card>

            {/* Live Leaderboard */}
            <Card className="p-6">
              <h3 className="font-jetbrains-mono text-xs uppercase tracking-[0.1em] text-on-surface-variant mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>leaderboard</span>
                Live Leaderboard
              </h3>
              {leaderboard.length === 0 ? (
                <p className="text-on-surface-variant text-sm text-center py-4">No participants yet.</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {leaderboard.slice(0, 10).map((voter, index) => {
                    const participant = voter.participant || voter.name;
                    const isAnonymous = !participant || participant.toLowerCase() === 'anonymous user' || participant.toLowerCase() === 'anonymous' || voter.isAnonymous;
                    const displayName = isAnonymous ? 'Anonymous' : participant;
                    const position = index + 1;

                    const positionColors = {
                      1: 'text-[#FFD700]',
                      2: 'text-[#C0C0C0]',
                      3: 'text-[#CD7F32]',
                    };
                    const positionColor = positionColors[position] || 'text-on-surface-variant';

                    return (
                      <div key={voter.id || voter._id || index} className="flex items-center gap-3 py-1.5">
                        <span className={`font-jetbrains-mono text-sm font-bold w-6 text-right ${positionColor}`}>
                          {position <= 3 ? ['🥇', '🥈', '🥉'][position - 1] : `#${position}`}
                        </span>
                        <span className={`font-hanken-grotesk text-sm flex-1 truncate ${isAnonymous ? 'text-on-surface-variant italic' : 'text-on-surface'}`}>
                          {displayName}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>

          {/* Activity Feed — Full width bottom */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              <h3 className="font-jetbrains-mono text-xs uppercase tracking-[0.1em] text-on-surface-variant mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>timeline</span>
                Participant Activity
              </h3>
              {activity.length === 0 ? (
                <p className="text-on-surface-variant text-sm text-center py-4">
                  Waiting for votes…
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {activity.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 text-sm py-1.5 border-b border-outline-variant/10 last:border-0 animate-[fadeIn_0.3s_ease-out]"
                    >
                      <span className="material-symbols-outlined text-tertiary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        how_to_vote
                      </span>
                      <span className="font-hanken-grotesk text-on-surface flex-1">{item.text}</span>
                      <span className="font-jetbrains-mono text-on-surface-variant text-xs">{item.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* End Poll Modal */}
      <Modal
        isOpen={endModal}
        onClose={() => !isEnding && setEndModal(false)}
        title="End Poll"
      >
        <p className="font-hanken-grotesk text-on-surface-variant mb-6">
          Are you sure you want to end "{poll.title}"? This will stop all new votes from being cast.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setEndModal(false)} disabled={isEnding}>
            Cancel
          </Button>
          <Button variant="danger" icon="stop_circle" onClick={handleEndPoll} loading={isEnding}>
            End Poll
          </Button>
        </div>
      </Modal>

      {/* Share Modal */}
      <Modal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title="Share Poll"
      >
        {poll.shareCode && (
          <QRCodeCard
            url={getShareUrl()}
            shareCode={poll.shareCode}
          />
        )}
      </Modal>
    </PageBackground>
  );
}
