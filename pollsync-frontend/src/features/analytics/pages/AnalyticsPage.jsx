import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnalytics, updateAnalyticsData, clearAnalytics } from '../analyticsSlice';
import { getSocket, SOCKET_EVENTS } from '../../../services/socket';
import PageBackground from '../../../components/layout/PageBackground';
import Spinner from '../../../components/ui/Spinner';
import Card from '../../../components/ui/Card';
import DataPill from '../../../components/ui/DataPill';
import VoteBar from '../../../components/ui/VoteBar';
import Button from '../../../components/ui/Button';

export default function AnalyticsPage() {
  const { pollId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: analytics, isLoading, error } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchAnalytics(pollId));

    return () => {
      dispatch(clearAnalytics());
    };
  }, [dispatch, pollId]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket.connected) {
      socket.connect();
    }
    socket.emit(SOCKET_EVENTS.JOIN_POLL, { pollId });

    const handleAnalyticsUpdate = (data) => {
      if (data && (data.id === pollId || data.pollId === pollId || data._id === pollId)) {
        dispatch(updateAnalyticsData(data));
      }
    };

    socket.on(SOCKET_EVENTS.ANALYTICS_UPDATE, handleAnalyticsUpdate);

    return () => {
      socket.emit(SOCKET_EVENTS.LEAVE_POLL, { pollId });
      socket.off(SOCKET_EVENTS.ANALYTICS_UPDATE, handleAnalyticsUpdate);
    };
  }, [pollId, dispatch]);

  if (isLoading && !analytics) {
    return (
      <PageBackground>
        <Spinner variant="fullpage" />
      </PageBackground>
    );
  }

  if (error || (!isLoading && !analytics)) {
    return (
      <PageBackground>
        <div className="max-w-md mx-auto pt-20 px-5">
          <Card className="text-center p-8">
            <h2 className="text-xl text-error mb-4 font-sora">Error</h2>
            <p className="text-on-surface-variant mb-6">{error || 'Analytics not available'}</p>
            <Button onClick={() => navigate('/dashboard')} variant="ghost">Go to Dashboard</Button>
          </Card>
        </div>
      </PageBackground>
    );
  }

  // Safe destructuring with fallbacks
  const poll = analytics.poll || analytics;
  const question = poll.title || poll.question || 'Poll Analytics';
  const totalVotes = analytics.totalVotes || 0;
  const authenticatedVotes = analytics.authenticatedVotes || 0;
  const anonymousVotes = analytics.anonymousVotes || 0;
  const engagementRate = analytics.engagementRate !== undefined ? analytics.engagementRate : 
                        (poll.totalParticipants > 0 ? ((totalVotes / poll.totalParticipants) * 100) : 0);

  const authPercentage = totalVotes > 0 ? Math.round((authenticatedVotes / totalVotes) * 100) : 0;
  const anonPercentage = totalVotes > 0 ? Math.round((anonymousVotes / totalVotes) * 100) : 0;

  // Extract all numeric/string fields for Card 3
  const summaryStats = Object.entries(analytics).filter(([key, value]) => {
    if (['poll', 'options', 'id', '_id', '__v'].includes(key)) return false;
    return typeof value === 'number' || typeof value === 'string';
  });

  return (
    <PageBackground>
      <div className="max-w-7xl mx-auto pt-10 pb-20 px-5 md:px-10 relative z-10">
        
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <p className="font-jetbrains-mono text-xs uppercase tracking-[0.1em] text-on-surface-variant mb-4">
            ANALYTICS
          </p>
          <h1 className="text-3xl md:text-4xl font-sora text-on-surface mb-8">
            {question}
          </h1>
          
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <DataPill icon="how_to_vote">{totalVotes} Total Votes</DataPill>
            <DataPill icon="person">{authenticatedVotes} Authenticated</DataPill>
            <DataPill icon="no_accounts">{anonymousVotes} Anonymous</DataPill>
            <DataPill icon="monitoring">{typeof engagementRate === 'number' ? engagementRate.toFixed(1) : engagementRate}% Engagement</DataPill>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card 1: Voter Type Breakdown */}
          <Card className="p-6 md:p-8 flex flex-col justify-center">
            <h3 className="font-jetbrains-mono text-xs uppercase tracking-[0.1em] text-on-surface-variant mb-6">
              Voter Type Breakdown
            </h3>
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 bg-primary/10 rounded-xl p-6 border border-primary/20 text-center transition-all hover:bg-primary/20">
                <p className="font-jetbrains-mono text-xs uppercase tracking-widest text-primary mb-2">Authenticated</p>
                <p className="font-sora text-4xl text-primary">{authPercentage}%</p>
                <p className="font-hanken-grotesk text-sm text-on-surface-variant mt-2">{authenticatedVotes} votes</p>
              </div>
              <div className="flex-1 bg-surface-container-high rounded-xl p-6 border border-outline-variant/30 text-center transition-all hover:bg-surface-container-highest">
                <p className="font-jetbrains-mono text-xs uppercase tracking-widest text-on-surface-variant mb-2">Anonymous</p>
                <p className="font-sora text-4xl text-on-surface-variant">{anonPercentage}%</p>
                <p className="font-hanken-grotesk text-sm text-on-surface-variant mt-2">{anonymousVotes} votes</p>
              </div>
            </div>
          </Card>

          {/* Card 2: Vote Distribution */}
          <Card className="p-6 md:p-8 lg:row-span-2">
            <h3 className="font-jetbrains-mono text-xs uppercase tracking-[0.1em] text-on-surface-variant mb-6">
              VOTE DISTRIBUTION
            </h3>
            <div className="flex flex-col gap-6">
              {analytics.options?.map((opt) => {
                const maxVotes = Math.max(...(analytics.options.map(o => o.voteCount || 0)));
                const isLeading = opt.voteCount > 0 && opt.voteCount === maxVotes;
                const percentage = totalVotes > 0 ? (opt.voteCount / totalVotes) * 100 : 0;
                
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
              {(!analytics.options || analytics.options.length === 0) && (
                <p className="text-on-surface-variant text-center py-10">No vote data available.</p>
              )}
            </div>
          </Card>

          {/* Card 3: Participation Summary */}
          <Card className="p-6 md:p-8">
            <h3 className="font-jetbrains-mono text-xs uppercase tracking-[0.1em] text-on-surface-variant mb-6">
              Participation Summary
            </h3>
            <div className="flex flex-wrap gap-3">
              {summaryStats.map(([key, value]) => {
                // Formatting key from camelCase to Title Case
                const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                return (
                  <DataPill key={key}>
                    <span className="text-on-surface mr-2">{formattedKey}:</span> {value}
                  </DataPill>
                );
              })}
              {summaryStats.length === 0 && (
                <p className="text-on-surface-variant text-sm">No additional summary data provided.</p>
              )}
            </div>
          </Card>
          
        </div>
      </div>
    </PageBackground>
  );
}
