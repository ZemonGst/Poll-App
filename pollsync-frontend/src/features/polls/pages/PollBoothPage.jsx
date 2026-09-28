import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPollThunk, submitVoteThunk, clearCurrentPoll } from '../pollSlice';
import { getSocket, SOCKET_EVENTS } from '../../../services/socket';
import PageBackground from '../../../components/layout/PageBackground';
import Spinner from '../../../components/ui/Spinner';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Timer from '../../../components/ui/Timer';
import LiveBadge from '../../../components/ui/LiveBadge';
import VoteBar from '../../../components/ui/VoteBar';

export default function PollBoothPage() {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentPoll: poll, isLoading, error } = useSelector((state) => state.poll);
  const { isAuthenticated, isLoading: isAuthLoading } = useSelector((state) => state.auth);
  
  const [isAnonymousMode, setIsAnonymousMode] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [hasVoted, setHasVoted] = useState(() => {
    // Restore voted state from localStorage on mount
    return pollId ? localStorage.getItem(`poll_${pollId}_voted`) === 'true' : false;
  });
  const [livePoll, setLivePoll] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasValidPollId = pollId && pollId !== 'undefined' && pollId !== 'null';
  const activePoll = livePoll || poll;

  useEffect(() => {
    if (!hasValidPollId) return undefined;

    dispatch(getPollThunk(pollId));

    return () => {
      dispatch(clearCurrentPoll());
    };
  }, [dispatch, pollId, hasValidPollId]);

  // Connect to socket and join the poll room immediately on page load.
  // This must NOT be gated on isAuthenticated/isAnonymousMode — if the socket
  // only connects after the auth gate is dismissed, the JOIN_POLL emit fires
  // after the vote API call in some cases, meaning the listener is registered
  // too late and the first vote-update event is missed.
  useEffect(() => {
    if (!hasValidPollId) return undefined;

    const socket = getSocket();

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit(SOCKET_EVENTS.JOIN_POLL, { pollId });

    const handleVoteUpdate = (data) => {
      // data.id is now always a string (fixed in pollRealtimeDto)
      if (data && data.id === pollId) {
        setLivePoll(data);
      }
    };

    const handlePollEnded = (data) => {
      if (data && (data.id === pollId || data.pollId === pollId)) {
        navigate(`/poll/${pollId}/results`);
      }
    };

    socket.on(SOCKET_EVENTS.VOTE_UPDATE, handleVoteUpdate);
    socket.on(SOCKET_EVENTS.POLL_ENDED, handlePollEnded);

    return () => {
      socket.emit(SOCKET_EVENTS.LEAVE_POLL, { pollId });
      socket.off(SOCKET_EVENTS.VOTE_UPDATE, handleVoteUpdate);
      socket.off(SOCKET_EVENTS.POLL_ENDED, handlePollEnded);
    };
  }, [pollId, navigate, hasValidPollId]);

  useEffect(() => {
    if (activePoll && activePoll.status === 'ended') {
      navigate(`/poll/${pollId}/results`, { replace: true });
    }
  }, [activePoll, navigate, pollId]);

  const handleOptionToggle = async (optionId) => {
    if (!activePoll || isSubmitting || hasVoted) return;
    
    setIsSubmitting(true);
    setSelectedOptions([optionId]);
    
    const dto = { optionId };
      
    const res = await dispatch(submitVoteThunk({
      id: pollId,
      dto: dto
    }));
    
    if (!res.error) {
      setHasVoted(true);
      localStorage.setItem(`poll_${pollId}_voted`, 'true');
    }
    setIsSubmitting(false);
  };

  const handleLoginRedirect = () => {
    localStorage.setItem('returnUrl', `/poll/${pollId}`);
    navigate('/auth');
  };

  if (!hasValidPollId) {
    return (
      <PageBackground>
        <div className="max-w-md mx-auto pt-20 px-5">
          <Card className="text-center p-8">
            <h2 className="text-xl text-error mb-4 font-sora">Invalid poll link</h2>
            <p className="text-on-surface-variant mb-6">
              This poll link is missing a valid poll ID.
            </p>
            <Button onClick={() => navigate('/auth')} variant="ghost">Go Home</Button>
          </Card>
        </div>
      </PageBackground>
    );
  }

  if (isLoading && !activePoll) {
    return (
      <PageBackground>
        <Spinner variant="fullpage" />
      </PageBackground>
    );
  }

  if (error || (!isLoading && !activePoll)) {
    return (
      <PageBackground>
        <div className="max-w-md mx-auto pt-20 px-5">
          <Card className="text-center p-8">
            <h2 className="text-xl text-error mb-4 font-sora">Error</h2>
            <p className="text-on-surface-variant mb-6">{error || 'Poll not found'}</p>
            <Button onClick={() => navigate('/auth')} variant="ghost">Go Home</Button>
          </Card>
        </div>
      </PageBackground>
    );
  }

  if (isAuthLoading && !isAnonymousMode) {
    return (
      <PageBackground>
        <Spinner variant="fullpage" />
      </PageBackground>
    );
  }

  // Auth Gate
  if (!isAuthenticated && !isAnonymousMode) {
    return (
      <PageBackground>
        <div className="max-w-md mx-auto pt-20 px-5">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-sora text-on-surface mb-2">Join the poll</h2>
            <p className="text-on-surface-variant mb-8 font-hanken-grotesk">
              Login for a chance to appear on the leaderboard
            </p>
            <div className="flex flex-col gap-4">
              <Button onClick={handleLoginRedirect} variant="ghost">
                Sign In
              </Button>
              <Button onClick={() => setIsAnonymousMode(true)} variant="ghost">
                Vote Anonymously
              </Button>
            </div>
          </Card>
        </div>
      </PageBackground>
    );
  }

  if (activePoll?.status === 'ended') {
    return null;
  }

  const calculateRemainingSeconds = () => {
    if (!activePoll?.expiresAt) return null;
    const remaining = Math.floor((new Date(activePoll.expiresAt) - new Date()) / 1000);
    return remaining > 0 ? remaining : 0;
  };
  const remainingSeconds = calculateRemainingSeconds();

  return (
    <PageBackground>
      <div className="max-w-2xl mx-auto pt-10 pb-20 px-5 md:px-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <LiveBadge />
          {remainingSeconds !== null && !hasVoted && (
            <Timer 
               seconds={remainingSeconds} 
               onExpire={() => {}}
            />
          )}
        </div>

        {/* Question */}
        <h1 className="text-3xl md:text-4xl font-sora text-on-surface text-center mb-10">
          {activePoll.title}
        </h1>
        
        {activePoll.description && (
          <p className="text-center text-on-surface-variant mb-8">
            {activePoll.description}
          </p>
        )}

        {/* Voted View — shows live results so the voter can watch updates in real-time */}
        {hasVoted ? (
          <div className="flex flex-col gap-6">
            <Card className="p-6 text-center flex items-center justify-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-tertiary/20 blur-xl rounded-full animate-pulse" />
                <span className="material-symbols-outlined text-3xl text-tertiary relative z-10" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              </div>
              <div>
                <p className="font-sora text-on-surface font-semibold">Your vote was counted!</p>
                <p className="text-on-surface-variant text-sm font-hanken-grotesk">Live results updating below</p>
              </div>
              <div className="flex gap-1 ml-2">
                <div className="w-1.5 h-1.5 rounded-full bg-tertiary/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-tertiary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-tertiary animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </Card>

            {/* Live vote bars */}
            <div className="flex flex-col gap-4">
              {activePoll.options.map((opt) => {
                const totalVotes = activePoll.totalVotes || 0;
                const pct = totalVotes > 0 ? Math.round((opt.voteCount / totalVotes) * 100) : 0;
                return (
                  <Card key={opt.id || opt._id} className="p-5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-hanken-grotesk text-on-surface">{opt.text}</span>
                      <span className="font-jetbrains-mono text-xs text-on-surface-variant">{opt.voteCount} votes · {pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-surface-container-high overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : (
          /* Voting View */
          <div className="flex flex-col gap-4">
            {activePoll.options.map((opt) => {
              const isSelected = selectedOptions.includes(opt.id || opt._id);
              const isMulti = activePoll.pollType === 'multiple-choice';
              
              return (
                <Card 
                  key={opt.id || opt._id}
                  onClick={() => handleOptionToggle(opt.id || opt._id)}
                  className={`
                    cursor-pointer p-6 flex items-center gap-4 transition-all duration-200
                    hover:border-primary/50 hover:bg-white/5
                    ${isSelected ? '!border-[#e85d8a] bg-[#e85d8a]/10 glow-active' : ''}
                  `}
                >
                  <span className={`material-symbols-outlined ${isSelected ? 'text-[#e85d8a]' : 'text-on-surface-variant'}`}>
                    {isMulti 
                      ? (isSelected ? 'check_box' : 'check_box_outline_blank')
                      : (isSelected ? 'radio_button_checked' : 'radio_button_unchecked')}
                  </span>
                  <span className="font-hanken-grotesk text-lg text-on-surface">
                    {opt.text}
                  </span>
                </Card>
              );
            })}
            
            {isSubmitting && (
              <div className="flex justify-center mt-6">
                <Spinner variant="inline" />
              </div>
            )}
          </div>
        )}
      </div>
    </PageBackground>
  );
}
