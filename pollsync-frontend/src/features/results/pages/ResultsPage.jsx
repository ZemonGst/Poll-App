import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResults, updateResultsData, clearResults } from '../resultsSlice';
import { fetchLeaderboard, updateLeaderboardData, clearLeaderboard } from '../../leaderboard/leaderboardSlice';
import { updateAnalyticsData } from '../../analytics/analyticsSlice';
import { getSocket, SOCKET_EVENTS } from '../../../services/socket';
import PageBackground from '../../../components/layout/PageBackground';
import Spinner from '../../../components/ui/Spinner';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import VoteBar from '../../../components/ui/VoteBar';
import DataPill from '../../../components/ui/DataPill';

export default function ResultsPage() {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: poll, isLoading, error } = useSelector((state) => state.results);
  const { data: leaderboardData } = useSelector((state) => state.leaderboard);
  const { user } = useSelector((state) => state.auth);

  const [copied, setCopied] = useState(false);
  const [animatedPercentages, setAnimatedPercentages] = useState({});
  const hasAnimatedIn = useRef(false);

  useEffect(() => {
    dispatch(fetchResults(pollId));

    return () => {
      dispatch(clearResults());
    };
  }, [dispatch, pollId]);

  useEffect(() => {
    if (poll?.showLeaderboard) {
      dispatch(fetchLeaderboard(pollId));
    }
    return () => {
      dispatch(clearLeaderboard());
    };
  }, [dispatch, pollId, poll?.showLeaderboard]);

  useEffect(() => {
    if (poll?.options) {
      if (!hasAnimatedIn.current) {
        hasAnimatedIn.current = true;
        poll.options.forEach((opt, index) => {
          const targetPercentage = poll.totalVotes > 0 ? (opt.voteCount / poll.totalVotes) * 100 : 0;
          setTimeout(() => {
            setAnimatedPercentages(prev => ({
              ...prev,
              [opt.id || opt._id]: targetPercentage
            }));
          }, index * 200);
        });
      } else {
        const newPercentages = {};
        poll.options.forEach((opt) => {
          newPercentages[opt.id || opt._id] = poll.totalVotes > 0 ? (opt.voteCount / poll.totalVotes) * 100 : 0;
        });
        setAnimatedPercentages(newPercentages);
      }
    }
  }, [poll]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket.connected) {
      socket.connect();
    }
    socket.emit(SOCKET_EVENTS.JOIN_POLL, { pollId });

    const handleResultsUpdate = (data) => {
      if (data && (data.id === pollId || data.pollId === pollId || data._id === pollId)) {
        dispatch(updateResultsData(data.poll || data));
      }
    };

    const handlePollEnded = (data) => {
      if (data && (data.id === pollId || data.pollId === pollId)) {
        dispatch(updateResultsData({ status: 'ended' }));
      }
    };

    const handleLeaderboardUpdate = (data) => {
      if (data && (data.id === pollId || data.pollId === pollId || data._id === pollId)) {
        dispatch(updateLeaderboardData(data));
      }
    };

    const handleAnalyticsUpdate = (data) => {
      if (data && (data.id === pollId || data.pollId === pollId || data._id === pollId)) {
        dispatch(updateAnalyticsData(data));
      }
    };

    socket.on(SOCKET_EVENTS.RESULTS_UPDATE, handleResultsUpdate);
    socket.on(SOCKET_EVENTS.POLL_ENDED, handlePollEnded);
    socket.on(SOCKET_EVENTS.LEADERBOARD_UPDATE, handleLeaderboardUpdate);
    socket.on(SOCKET_EVENTS.ANALYTICS_UPDATE, handleAnalyticsUpdate);

    // Also listen to VOTE_UPDATE just in case backend uses it for results updates
    const handleVoteUpdate = (data) => {
      if (data && (data.id === pollId || data.pollId === pollId || data._id === pollId)) {
        dispatch(updateResultsData(data.poll || data));
      }
    };
    socket.on(SOCKET_EVENTS.VOTE_UPDATE, handleVoteUpdate);

    return () => {
      socket.emit(SOCKET_EVENTS.LEAVE_POLL, { pollId });
      socket.off(SOCKET_EVENTS.RESULTS_UPDATE, handleResultsUpdate);
      socket.off(SOCKET_EVENTS.POLL_ENDED, handlePollEnded);
      socket.off(SOCKET_EVENTS.VOTE_UPDATE, handleVoteUpdate);
      socket.off(SOCKET_EVENTS.LEADERBOARD_UPDATE, handleLeaderboardUpdate);
      socket.off(SOCKET_EVENTS.ANALYTICS_UPDATE, handleAnalyticsUpdate);
    };
  }, [pollId, dispatch]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading && !poll) {
    return (
      <PageBackground>
        <div className="max-w-3xl mx-auto pt-20 px-5 flex flex-col gap-4">
          {/* Skeleton loading */}
          <div className="h-8 bg-surface-container-high rounded animate-pulse w-48 mx-auto mb-4" />
          <div className="h-12 bg-surface-container-high rounded animate-pulse w-3/4 mx-auto mb-8" />
          <Card className="p-8">
            <div className="h-4 bg-surface-container-high rounded animate-pulse w-1/4 mb-2" />
            <div className="h-6 bg-surface-container-high rounded animate-pulse w-full mb-6" />
            <div className="h-4 bg-surface-container-high rounded animate-pulse w-1/4 mb-2" />
            <div className="h-6 bg-surface-container-high rounded animate-pulse w-full mb-6" />
          </Card>
        </div>
      </PageBackground>
    );
  }

  if (error || (!isLoading && !poll)) {
    return (
      <PageBackground>
        <div className="max-w-md mx-auto pt-20 px-5">
          <Card className="text-center p-8">
            <h2 className="text-xl text-error mb-4 font-sora">Error</h2>
            <p className="text-on-surface-variant mb-6">{error || 'Results not available'}</p>
            <Button onClick={() => navigate('/')} variant="ghost">Go Home</Button>
          </Card>
        </div>
      </PageBackground>
    );
  }

  const maxVotes = Math.max(...(poll.options?.map(o => o.voteCount || 0) || [0]));

  const showLeaderboard = poll.showLeaderboard || poll.settings?.showLeaderboard;
  const showAnalytics = poll.showAdvancedAnalytics || poll.settings?.showAdvancedAnalytics;
  const isOwner = user && (user.id === poll.creator || user._id === poll.creator || user.id === poll.creatorId);

  return (
    <PageBackground>
      <div className="max-w-3xl mx-auto pt-10 pb-20 px-5 md:px-10">
        {/* Top Section */}
        <div className="text-center mb-10">
          <p className="font-jetbrains-mono text-xs uppercase tracking-[0.1em] text-on-surface-variant mb-4">
            POLL RESULTS
          </p>
          <h1 className="text-3xl md:text-4xl font-sora text-on-surface mb-8">
            {poll.title || poll.question}
          </h1>
          <div className="flex flex-wrap justify-center gap-3">
            <DataPill icon="how_to_vote">{poll.totalVotes || 0} TOTAL VOTES</DataPill>
            {poll.totalParticipants !== undefined && (
              <DataPill icon="people">{poll.totalParticipants} PARTICIPANTS</DataPill>
            )}
            <DataPill icon="info">{poll.status === 'ended' ? 'ENDED' : 'ACTIVE'}</DataPill>
          </div>
        </div>

        {/* Results Section */}
        <Card className="p-6 md:p-8 mb-8">
          <div className="flex flex-col gap-6">
            {poll.options?.map((opt) => {
              const isLeading = opt.voteCount > 0 && opt.voteCount === maxVotes;
              const targetPercentage = poll.totalVotes > 0 
                ? (opt.voteCount / poll.totalVotes) * 100 
                : 0;
              const displayPercentage = animatedPercentages[opt.id || opt._id] !== undefined 
                ? animatedPercentages[opt.id || opt._id] 
                : 0;

              const CustomLabel = (
                <span className="flex items-center gap-2">
                  {isLeading && (
                    <span 
                      className="material-symbols-outlined text-tertiary" 
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      workspace_premium
                    </span>
                  )}
                  <span className={`${isLeading ? "text-tertiary font-bold text-lg" : "text-on-surface"} transition-all duration-300`}>
                    {opt.text}
                  </span>
                </span>
              );

              return (
                <VoteBar 
                  key={opt.id || opt._id}
                  percentage={displayPercentage}
                  label={CustomLabel}
                  votes={opt.voteCount || 0}
                  isLeading={isLeading}
                />
              );
            })}
          </div>
        </Card>

        {/* Analytics Section (Public) */}
        {showAnalytics && poll.analytics && (
          <div className="mb-12">
            <h2 className="font-jetbrains-mono text-[12px] uppercase tracking-[0.2em] text-on-surface-variant mb-6 text-center">
              Public Analytics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-surface-container-high p-4 rounded-xl text-center border border-outline-variant/20 transition-all hover:bg-surface-container-highest">
                <p className="text-[10px] font-jetbrains-mono text-on-surface-variant uppercase mb-1">Total Votes</p>
                <p className="text-2xl font-sora text-primary">{poll.totalVotes}</p>
              </div>
              <div className="bg-surface-container-high p-4 rounded-xl text-center border border-outline-variant/20 transition-all hover:bg-surface-container-highest">
                <p className="text-[10px] font-jetbrains-mono text-on-surface-variant uppercase mb-1">Participants</p>
                <p className="text-2xl font-sora text-secondary">{poll.analytics.uniqueParticipants || 0}</p>
              </div>
              <div className="bg-surface-container-high p-4 rounded-xl text-center border border-outline-variant/20 transition-all hover:bg-surface-container-highest">
                <p className="text-[10px] font-jetbrains-mono text-on-surface-variant uppercase mb-1">Authenticated</p>
                <p className="text-2xl font-sora text-tertiary">{poll.analytics.authenticatedVotes || 0}</p>
              </div>
              <div className="bg-surface-container-high p-4 rounded-xl text-center border border-outline-variant/20 transition-all hover:bg-surface-container-highest">
                <p className="text-[10px] font-jetbrains-mono text-on-surface-variant uppercase mb-1">Anonymous</p>
                <p className="text-2xl font-sora text-on-surface-variant">{poll.analytics.anonymousVotes || 0}</p>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Section */}
        {showLeaderboard && leaderboardData && (
          <div className="mb-12">
            <h2 className="font-jetbrains-mono text-[12px] uppercase tracking-[0.2em] text-on-surface-variant mb-6 text-center">
              Top Fastest Voters
            </h2>
            <div className="flex flex-col gap-3">
              {(leaderboardData.leaderboard || leaderboardData.rankings || leaderboardData.topVoters || []).slice(0, 5).map((voter, index) => {
                const participant = voter.participant || voter.name || 'Anonymous';
                const isAnonymous = voter.isAnonymous || participant.toLowerCase() === 'anonymous';
                return (
                  <Card key={index} className="p-4 flex items-center justify-between transition-all hover:bg-surface-container-high">
                    <div className="flex items-center gap-4">
                      <span className="font-jetbrains-mono text-primary font-bold w-6">#{index + 1}</span>
                      <span className={`font-hanken-grotesk ${isAnonymous ? 'italic text-on-surface-variant' : 'text-on-surface font-medium'}`}>
                        {isAnonymous ? 'Anonymous' : participant}
                      </span>
                    </div>
                    <span className="font-jetbrains-mono text-xs text-on-surface-variant bg-surface-container rounded px-2 py-1">
                      {voter.voteTime ? `${voter.voteTime}ms` : 'Just now'}
                    </span>
                  </Card>
                );
              })}
              {!(leaderboardData.leaderboard || leaderboardData.rankings || []).length && (
                <p className="text-center text-on-surface-variant font-hanken-grotesk py-4 italic">No rankings available yet.</p>
              )}
              <Button 
                onClick={() => navigate(`/poll/${pollId}/leaderboard`)} 
                variant="ghost" 
                size="sm"
                className="self-center mt-2"
                icon="expand_more"
              >
                View Full Leaderboard
              </Button>
            </div>
          </div>
        )}

        {/* Bottom Links */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4">
          <Button 
            onClick={handleShare} 
            variant="ghost" 
            icon={copied ? "check" : "share"}
          >
            {copied ? "Copied!" : "Share Results"}
          </Button>

          {showLeaderboard && (
            <Button 
              onClick={() => navigate(`/poll/${pollId}/leaderboard`)} 
              variant="ghost" 
              icon="leaderboard"
            >
              Full Rankings
            </Button>
          )}

          {(isOwner || showAnalytics) && (
            <Button 
              onClick={() => navigate(`/poll/${pollId}/analytics`)} 
              variant="ghost" 
              icon="bar_chart"
            >
              {isOwner ? "Full Analytics" : "Public Stats"}
            </Button>
          )}
        </div>
      </div>
    </PageBackground>
  );
}
