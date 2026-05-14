import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaderboard, updateLeaderboardData, clearLeaderboard } from '../leaderboardSlice';
import { getSocket, SOCKET_EVENTS } from '../../../services/socket';
import PageBackground from '../../../components/layout/PageBackground';
import LiveBadge from '../../../components/ui/LiveBadge';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function LeaderboardPage() {
  const { pollId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: leaderboard, isLoading, error } = useSelector((state) => state.leaderboard);
  const animatedRankings = leaderboard?.leaderboard || leaderboard?.rankings || leaderboard?.topVoters || [];

  useEffect(() => {
    dispatch(fetchLeaderboard(pollId));

    return () => {
      dispatch(clearLeaderboard());
    };
  }, [dispatch, pollId]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket.connected) {
      socket.connect();
    }
    socket.emit(SOCKET_EVENTS.JOIN_POLL, { pollId });

    const handleLeaderboardUpdate = (data) => {
      if (data && (data.id === pollId || data.pollId === pollId || data._id === pollId)) {
        dispatch(updateLeaderboardData(data));
      }
    };

    socket.on(SOCKET_EVENTS.LEADERBOARD_UPDATE, handleLeaderboardUpdate);

    return () => {
      socket.emit(SOCKET_EVENTS.LEAVE_POLL, { pollId });
      socket.off(SOCKET_EVENTS.LEADERBOARD_UPDATE, handleLeaderboardUpdate);
    };
  }, [pollId, dispatch]);

  if (isLoading && !leaderboard) {
    return (
      <PageBackground>
        <div className="max-w-3xl mx-auto pt-20 px-5 flex flex-col gap-4">
          <div className="flex justify-center mb-4"><div className="w-16 h-6 bg-surface-container-high rounded-full animate-pulse" /></div>
          <div className="h-4 bg-surface-container-high rounded animate-pulse w-32 mx-auto mb-4" />
          <div className="h-10 bg-surface-container-high rounded animate-pulse w-2/3 mx-auto mb-10" />
          
          <Card className="p-8 h-32 animate-pulse mb-4" />
          <Card className="p-6 h-24 animate-pulse mb-4" />
          <Card className="p-6 h-24 animate-pulse mb-4" />
          <div className="h-16 bg-surface-container-high rounded-xl animate-pulse w-full" />
        </div>
      </PageBackground>
    );
  }

  if (error || (!isLoading && !leaderboard)) {
    return (
      <PageBackground>
        <div className="max-w-md mx-auto pt-20 px-5">
          <Card className="text-center p-8">
            <h2 className="text-xl text-error mb-4 font-sora">Error</h2>
            <p className="text-on-surface-variant mb-6">{error || 'Leaderboard not available'}</p>
            <Button onClick={() => navigate(`/poll/${pollId}`)} variant="ghost">Go Back</Button>
          </Card>
        </div>
      </PageBackground>
    );
  }

  const poll = leaderboard.poll || leaderboard;
  const question = poll.title || poll.question || 'Poll Leaderboard';
  const isActive = poll.status !== 'ended';

  return (
    <PageBackground>
      <div className="max-w-4xl mx-auto pt-10 pb-20 px-5 md:px-10 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12">
          {isActive && (
            <div className="flex justify-center mb-6">
              <LiveBadge />
            </div>
          )}
          <p className="font-jetbrains-mono text-xs uppercase tracking-[0.1em] text-on-surface-variant mb-4">
            LEADERBOARD
          </p>
          <h1 className="text-3xl md:text-4xl font-sora text-on-surface">
            {question}
          </h1>
        </div>

        {/* Rankings List */}
        <div className="flex flex-col gap-4 relative">
          {animatedRankings.length === 0 ? (
            <Card className="p-10 text-center">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4 block" style={{ fontVariationSettings: "'FILL' 0" }}>
                emoji_events
              </span>
              <h3 className="font-sora text-xl text-on-surface mb-2">No participants yet</h3>
              <p className="text-on-surface-variant font-hanken-grotesk">Be the first to vote!</p>
            </Card>
          ) : (
            animatedRankings.map((voter, index) => {
              const position = index + 1;
              const participant = voter.participant || voter.name;
              const isAnonymous = !participant || participant.toLowerCase() === 'anonymous user' || participant.toLowerCase() === 'anonymous' || voter.isAnonymous;
              const displayName = isAnonymous ? 'Anonymous' : participant;
              
              const formatTime = (timeStr) => {
                if (!timeStr) return '';
                // Check if it's just a number (ms) or actual date string
                if (typeof timeStr === 'number' || (typeof timeStr === 'string' && timeStr.match(/^[0-9]+$/))) {
                  return `${timeStr} ms`;
                }
                const d = new Date(timeStr);
                if (!isNaN(d.getTime())) {
                  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                }
                return timeStr;
              };

              // Position 1 (Gold)
              if (position === 1) {
                return (
                  <div key={voter.id || voter._id || index} className="glass-panel-elevated rounded-xl p-6 md:p-8 flex items-center gap-6 shadow-[0_0_30px_rgba(255,215,0,0.15)] border border-[#FFD700]/30 transition-all duration-500 ease-in-out transform">
                    <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/50 text-[#FFD700]">
                      <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        workspace_premium
                      </span>
                    </div>
                    <div className="flex-1">
                      <h2 className={`font-sora text-2xl md:text-3xl ${isAnonymous ? 'text-on-surface-variant italic font-hanken-grotesk' : 'text-[#FFD700]'}`}>
                        {displayName}
                      </h2>
                    </div>
                    <div className="text-right">
                      <p className="font-jetbrains-mono text-[#FFD700] text-lg md:text-xl">
                        {formatTime(voter.votedAt || voter.voteTime || voter.time)}
                      </p>
                    </div>
                  </div>
                );
              }

              // Position 2 (Silver)
              if (position === 2) {
                return (
                  <div key={voter.id || voter._id || index} className="glass-panel rounded-xl p-5 md:p-6 flex items-center gap-5 border border-[#C0C0C0]/20 transition-all duration-500 ease-in-out transform">
                    <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-[#C0C0C0]/10 border border-[#C0C0C0]/40 text-[#C0C0C0] font-sora text-xl font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-sora text-xl md:text-2xl ${isAnonymous ? 'text-on-surface-variant italic font-hanken-grotesk' : 'text-[#C0C0C0]'}`}>
                        {displayName}
                      </h3>
                    </div>
                    <div className="text-right">
                      <p className="font-jetbrains-mono text-[#C0C0C0] text-md md:text-lg">
                        {formatTime(voter.votedAt || voter.voteTime || voter.time)}
                      </p>
                    </div>
                  </div>
                );
              }

              // Position 3 (Bronze)
              if (position === 3) {
                return (
                  <div key={voter.id || voter._id || index} className="glass-panel rounded-xl p-4 md:p-5 flex items-center gap-4 border border-[#CD7F32]/20 transition-all duration-500 ease-in-out transform">
                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-[#CD7F32]/10 border border-[#CD7F32]/40 text-[#CD7F32] font-sora text-lg font-bold">
                      3
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-sora text-lg md:text-xl ${isAnonymous ? 'text-on-surface-variant italic font-hanken-grotesk' : 'text-[#CD7F32]'}`}>
                        {displayName}
                      </h3>
                    </div>
                    <div className="text-right">
                      <p className="font-jetbrains-mono text-[#CD7F32]">
                        {formatTime(voter.votedAt || voter.voteTime || voter.time)}
                      </p>
                    </div>
                  </div>
                );
              }

              // Position 4+
              return (
                <Card key={voter.id || voter._id || index} className="p-4 flex items-center gap-4 transition-all duration-500 ease-in-out transform hover:bg-surface-bright">
                  <div className="flex-shrink-0 w-8 text-center">
                    <span className="font-jetbrains-mono text-on-surface-variant text-lg">#{position}</span>
                  </div>
                  <div className="flex-1">
                    <span className={`font-hanken-grotesk text-lg ${isAnonymous ? 'text-on-surface-variant italic' : 'text-on-surface'}`}>
                      {displayName}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-jetbrains-mono text-on-surface-variant">
                      {formatTime(voter.votedAt || voter.voteTime || voter.time)}
                    </span>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </PageBackground>
  );
}
