import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageBackground from '../../../components/layout/PageBackground';
import Button from '../../../components/ui/Button';

export default function LandingPage() {
  const navigate = useNavigate();
  const observerRef = useRef(null);

  // Demo State for Section 5
  const [demoTimer, setDemoTimer] = useState(30);
  const [demoVotes, setDemoVotes] = useState([142, 85, 64, 12]);
  const [demoSelection, setDemoSelection] = useState(0);

  const [votes, setVotes] = useState([
    { id: 1, label: 'Dark Mode', count: 142, percentage: 45 },
    { id: 2, label: 'Anonymous Voting', count: 89, percentage: 28 },
    { id: 3, label: 'Realtime Results', count: 86, percentage: 27 },
  ]);

  useEffect(() => {
    // Intersection Observer logic
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          entry.target.classList.remove('opacity-0');
          observerRef.current.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.observe-me');
    elements.forEach(el => observerRef.current.observe(el));

    // Demo Intervals
    const timerInterval = setInterval(() => {
      setDemoTimer(prev => prev > 0 ? prev - 1 : 30);
    }, 1000);

    const selectionInterval = setInterval(() => {
      setDemoSelection(prev => (prev + 1) % 4);
      setDemoVotes(prev => {
        const newVotes = [...prev];
        const randomOption = Math.floor(Math.random() * 4);
        newVotes[randomOption] += Math.floor(Math.random() * 3) + 1; // Add 1-3 votes
        return newVotes;
      });
    }, 1500);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      clearInterval(timerInterval);
      clearInterval(selectionInterval);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setVotes(prev => {
        const updated = prev.map(v => {
          const change = Math.floor(Math.random() * 5) - 1;
          return {
            ...v,
            count: Math.max(1, v.count + change),
          };
        });
        const total = updated.reduce((sum, v) => sum + v.count, 0);
        return updated.map(v => ({
          ...v,
          percentage: Math.round((v.count / total) * 100),
        }));
      });
    }, 300);
    return () => clearInterval(interval);
  }, []);

  const handleScrollDown = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <div className="relative min-h-screen font-hanken-grotesk overflow-hidden selection:bg-tertiary/30">
      <PageBackground />
      
      {/* SECTION 1: Navbar */}
      <nav className="sticky top-0 z-50 h-16 glass-panel border-b border-outline-variant/20 flex items-center justify-between px-5 md:px-10">
        <div className="flex items-center gap-2">
          {/* Pulsing Electric Flash Logo (Small) */}
          <div className="relative flex items-center gap-2">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-8 h-8 rounded-full bg-tertiary/20 animate-ping" />
              <div className="absolute w-8 h-8 rounded-full bg-tertiary/10 blur-sm" />
              <span
                className="material-symbols-outlined relative z-10 text-tertiary"
                style={{
                  fontVariationSettings: "'FILL' 1",
                  fontSize: '24px',
                  animation: 'electric-pulse 2s ease-in-out infinite',
                }}
              >
                bolt
              </span>
            </div>
            <span className="font-sora font-bold text-xl text-primary">
              PollSync
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/auth')} className="hidden sm:flex">
            Sign In
          </Button>
          <Button variant="primary" onClick={() => navigate('/auth')} className="bg-[#e85d8a] text-white hover:bg-[#e85d8a]/90 glow-active border-none">
            Get Started
          </Button>
        </div>
      </nav>

      {/* SECTION 2: Hero */}
      <section className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center pt-16 pb-20 px-5 overflow-hidden">
        {/* Top Live Badge */}
        <div className="mb-6 inline-flex items-center gap-1.5 bg-tertiary/10 text-tertiary font-jetbrains-mono text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border border-tertiary/20 shadow-[0_0_15px_rgba(183,207,135,0.2)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary" />
          </span>
          ACTIVE NOW
        </div>

        {/* Large Pulsing Flash Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative flex items-center gap-2">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-14 h-14 rounded-full bg-tertiary/20 animate-ping" />
              <div className="absolute w-8 h-8 rounded-full bg-tertiary/10 blur-sm" />
              <span
                className="material-symbols-outlined relative z-10 text-tertiary"
                style={{
                  fontVariationSettings: "'FILL' 1",
                  fontSize: '48px',
                  animation: 'electric-pulse 2s ease-in-out infinite',
                }}
              >
                bolt
              </span>
            </div>
            <span className="font-sora font-bold text-xl text-primary">
              PollSync
            </span>
          </div>
        </div>

        {/* Headlines */}
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-sora font-bold text-center leading-tight mb-6 text-on-surface">
          Create Polls That <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-tertiary to-primary-fixed">Actually Live.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-on-surface-variant font-hanken-grotesk text-center max-w-2xl mb-10">
          Share a link. Watch votes roll in. See results in realtime.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 z-20 w-full sm:w-auto">
          <Button variant="primary" onClick={() => navigate('/auth')} className="w-full sm:w-auto bg-[#e85d8a] text-white hover:bg-[#e85d8a]/90 glow-active border-none px-8 py-4 text-lg">
            Start Polling Free
          </Button>
          <Button variant="ghost" onClick={handleScrollDown} className="w-full sm:w-auto px-8 py-4 text-lg">
            See How It Works
          </Button>
        </div>

        {/* Hero Visual Mockup */}
        <div className="w-full max-w-sm mx-auto animate-float-silk z-10 relative mt-4">
          {/* Decorative background glow behind the card */}
          <div className="absolute -inset-4 bg-tertiary/20 blur-[50px] rounded-full z-0" />
          
          <div className="glass-panel rounded-xl p-6 relative z-10 border border-outline-variant/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-center mb-6">
              <span className="font-jetbrains-mono text-[10px] uppercase text-on-surface-variant tracking-wider">PREVIEW</span>
              <div className="inline-flex items-center gap-1.5 bg-tertiary/10 text-tertiary font-jetbrains-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-tertiary/20">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-tertiary" />
                </span>
                LIVE
              </div>
            </div>
            
            <h3 className="font-sora text-xl text-on-surface mb-6 font-medium">Which feature should we build next?</h3>
            
            <div className="flex flex-col gap-4 w-full">
              {votes.map((option) => (
                <div key={option.id} className="w-full">
                  <div className="flex justify-between items-center text-sm mb-2 font-hanken-grotesk">
                    <span className="text-on-surface font-medium flex items-center gap-2">
                      {option.label}
                      <span className="font-jetbrains-mono text-on-surface-variant/70 text-xs font-normal">
                        ({option.count} votes)
                      </span>
                    </span>
                    <span className="font-jetbrains-mono text-tertiary font-bold">{option.percentage}%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden border border-outline-variant/10">
                    <div
                      className="h-2 rounded-full bg-tertiary"
                      style={{
                        width: `${option.percentage}%`,
                        transition: 'width 0.25s ease-out',
                        boxShadow: '0 0 8px rgba(183,207,135,0.5)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: How It Works */}
      <section id="how-it-works" className="w-full max-w-7xl mx-auto py-24 px-5">
        <div className="text-center mb-16 observe-me opacity-0">
          <h2 className="text-3xl md:text-5xl font-sora font-bold text-on-surface mb-4">How PollSync Works</h2>
          <p className="text-lg text-on-surface-variant font-hanken-grotesk">Three steps to realtime engagement</p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 relative">
          {/* Step 1 */}
          <div className="glass-panel rounded-xl p-8 flex-1 w-full text-center observe-me opacity-0 relative z-10" style={{ animationDelay: '0ms' }}>
            <span className="font-jetbrains-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-6 block">STEP 01</span>
            <span 
              className="material-symbols-outlined text-[48px] text-tertiary mb-6"
              style={{ fontVariationSettings: "'FILL' 1", filter: 'drop-shadow(0 0 12px rgba(183,207,135,0.4))' }}
            >
              edit_document
            </span>
            <h3 className="font-sora text-xl font-semibold text-on-surface mb-3">Create Your Poll</h3>
            <p className="font-hanken-grotesk text-on-surface-variant">Build your poll in seconds with multiple options and a live timer.</p>
          </div>

          {/* Arrow 1 */}
          <div className="hidden md:block observe-me opacity-0" style={{ animationDelay: '75ms' }}>
            <span className="material-symbols-outlined text-tertiary text-4xl opacity-50">arrow_forward</span>
          </div>

          {/* Step 2 */}
          <div className="glass-panel rounded-xl p-8 flex-1 w-full text-center observe-me opacity-0 relative z-10" style={{ animationDelay: '150ms' }}>
            <span className="font-jetbrains-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-6 block">STEP 02</span>
            <span 
              className="material-symbols-outlined text-[48px] text-tertiary mb-6"
              style={{ fontVariationSettings: "'FILL' 1", filter: 'drop-shadow(0 0 12px rgba(183,207,135,0.4))' }}
            >
              qr_code_2
            </span>
            <h3 className="font-sora text-xl font-semibold text-on-surface mb-3">Share Instantly</h3>
            <p className="font-hanken-grotesk text-on-surface-variant">Share a URL or let participants scan a QR code to join instantly.</p>
          </div>

          {/* Arrow 2 */}
          <div className="hidden md:block observe-me opacity-0" style={{ animationDelay: '225ms' }}>
            <span className="material-symbols-outlined text-tertiary text-4xl opacity-50">arrow_forward</span>
          </div>

          {/* Step 3 */}
          <div className="glass-panel rounded-xl p-8 flex-1 w-full text-center observe-me opacity-0 relative z-10" style={{ animationDelay: '300ms' }}>
            <span className="font-jetbrains-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-6 block">STEP 03</span>
            <span 
              className="material-symbols-outlined text-[48px] text-tertiary mb-6"
              style={{ fontVariationSettings: "'FILL' 1", filter: 'drop-shadow(0 0 12px rgba(183,207,135,0.4))' }}
            >
              bar_chart
            </span>
            <h3 className="font-sora text-xl font-semibold text-on-surface mb-3">Watch It Live</h3>
            <p className="font-hanken-grotesk text-on-surface-variant">See votes update in realtime across all connected devices.</p>
          </div>
        </div>
      </section>

      {/* SECTION 4: Features Grid */}
      <section className="w-full max-w-7xl mx-auto py-24 px-5 relative">
        {/* Background decorative blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="text-center mb-16 observe-me opacity-0">
          <h2 className="text-3xl md:text-5xl font-sora font-bold text-on-surface">Everything You Need</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {/* Card 1 */}
          <div className="glass-panel rounded-xl p-6 transition-all duration-300 hover:border-primary/30 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(218,194,175,0.1)] observe-me opacity-0" style={{ animationDelay: '0ms' }}>
            <span 
              className="material-symbols-outlined text-[40px] text-tertiary mb-4"
              style={{ fontVariationSettings: "'FILL' 1", filter: 'drop-shadow(0 0 8px rgba(183,207,135,0.3))' }}
            >
              bolt
            </span>
            <h3 className="font-sora text-xl text-on-surface mb-2 font-semibold">Realtime Voting</h3>
            <p className="font-hanken-grotesk text-sm text-on-surface-variant">Votes appear instantly as participants click.</p>
          </div>

          {/* Card 2 */}
          <div className="glass-panel rounded-xl p-6 transition-all duration-300 hover:border-primary/30 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(218,194,175,0.1)] observe-me opacity-0" style={{ animationDelay: '100ms' }}>
            <span 
              className="material-symbols-outlined text-[40px] text-tertiary mb-4"
              style={{ fontVariationSettings: "'FILL' 1", filter: 'drop-shadow(0 0 8px rgba(183,207,135,0.3))' }}
            >
              qr_code_2
            </span>
            <h3 className="font-sora text-xl text-on-surface mb-2 font-semibold">QR Code Sharing</h3>
            <p className="font-hanken-grotesk text-sm text-on-surface-variant">Share polls with a scannable QR code.</p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel rounded-xl p-6 transition-all duration-300 hover:border-primary/30 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(218,194,175,0.1)] observe-me opacity-0" style={{ animationDelay: '200ms' }}>
            <span 
              className="material-symbols-outlined text-[40px] text-tertiary mb-4"
              style={{ fontVariationSettings: "'FILL' 1", filter: 'drop-shadow(0 0 8px rgba(183,207,135,0.3))' }}
            >
              leaderboard
            </span>
            <h3 className="font-sora text-xl text-on-surface mb-2 font-semibold">Live Leaderboard</h3>
            <p className="font-hanken-grotesk text-sm text-on-surface-variant">Rank fastest voters in realtime.</p>
          </div>

          {/* Card 4 */}
          <div className="glass-panel rounded-xl p-6 transition-all duration-300 hover:border-primary/30 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(218,194,175,0.1)] observe-me opacity-0" style={{ animationDelay: '300ms' }}>
            <span 
              className="material-symbols-outlined text-[40px] text-tertiary mb-4"
              style={{ fontVariationSettings: "'FILL' 1", filter: 'drop-shadow(0 0 8px rgba(183,207,135,0.3))' }}
            >
              bar_chart
            </span>
            <h3 className="font-sora text-xl text-on-surface mb-2 font-semibold">Analytics</h3>
            <p className="font-hanken-grotesk text-sm text-on-surface-variant">Track authenticated vs anonymous voters.</p>
          </div>

          {/* Card 5 */}
          <div className="glass-panel rounded-xl p-6 transition-all duration-300 hover:border-primary/30 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(218,194,175,0.1)] observe-me opacity-0" style={{ animationDelay: '400ms' }}>
            <span 
              className="material-symbols-outlined text-[40px] text-tertiary mb-4"
              style={{ fontVariationSettings: "'FILL' 1", filter: 'drop-shadow(0 0 8px rgba(183,207,135,0.3))' }}
            >
              timer
            </span>
            <h3 className="font-sora text-xl text-on-surface mb-2 font-semibold">Poll Timer</h3>
            <p className="font-hanken-grotesk text-sm text-on-surface-variant">Auto-end polls after your set duration.</p>
          </div>

          {/* Card 6 */}
          <div className="glass-panel rounded-xl p-6 transition-all duration-300 hover:border-primary/30 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(218,194,175,0.1)] observe-me opacity-0" style={{ animationDelay: '500ms' }}>
            <span 
              className="material-symbols-outlined text-[40px] text-tertiary mb-4"
              style={{ fontVariationSettings: "'FILL' 1", filter: 'drop-shadow(0 0 8px rgba(183,207,135,0.3))' }}
            >
              how_to_vote
            </span>
            <h3 className="font-sora text-xl text-on-surface mb-2 font-semibold">Anonymous Voting</h3>
            <p className="font-hanken-grotesk text-sm text-on-surface-variant">Let anyone vote without signing up.</p>
          </div>
        </div>
      </section>

      {/* SECTION 5: Live Demo Preview */}
      <section className="w-full max-w-7xl mx-auto py-24 px-5">
        <div className="text-center mb-16 observe-me opacity-0">
          <h2 className="text-3xl md:text-5xl font-sora font-bold text-on-surface mb-4">See It In Action</h2>
          <p className="text-lg text-on-surface-variant font-hanken-grotesk">Experience the realtime synchronization</p>
        </div>

        <div className="glass-panel-elevated rounded-2xl overflow-hidden border border-outline-variant/30 relative observe-me opacity-0 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {/* Subtle glow behind the demo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-tertiary/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-outline-variant/20 relative z-10">
            {/* Left side: Poll Booth */}
            <div className="bg-[#1d1b1a] p-8 md:p-12 flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <div className="inline-flex items-center gap-1.5 bg-tertiary/10 text-tertiary font-jetbrains-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border border-tertiary/20">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-tertiary" />
                  </span>
                  LIVE
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant font-jetbrains-mono bg-surface-container px-3 py-1.5 rounded-md border border-outline-variant/10 text-sm">
                  <span className="material-symbols-outlined text-sm">timer</span>
                  00:{demoTimer.toString().padStart(2, '0')}
                </div>
              </div>

              <h3 className="font-sora text-2xl text-on-surface mb-8 font-medium">Which feature should we build next?</h3>

              <div className="flex flex-col gap-4 flex-1">
                {['Dark Mode', 'Anonymous Voting', 'Zapier Integration', 'Custom Domains'].map((option, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                      demoSelection === index 
                        ? 'bg-tertiary/10 border-tertiary shadow-[0_0_15px_rgba(183,207,135,0.1)]' 
                        : 'bg-surface-container-high border-outline-variant/10'
                    }`}
                  >
                    <span className={`font-hanken-grotesk ${demoSelection === index ? 'text-tertiary font-semibold' : 'text-on-surface'}`}>
                      {option} {index === 0 && <span className="text-on-surface-variant font-normal">(wait, we have that)</span>}
                    </span>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      demoSelection === index ? 'border-tertiary bg-tertiary' : 'border-outline-variant/40 bg-surface'
                    }`}>
                      {demoSelection === index && <span className="material-symbols-outlined text-[12px] text-surface-container-lowest font-bold">check</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side: Live Results */}
            <div className="bg-[#1d1b1a] p-8 md:p-12 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                 <span className="font-jetbrains-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/50">RESULTS VIEW</span>
              </div>
              
              <h3 className="font-sora text-xl text-on-surface mb-8 font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">bar_chart</span>
                Live Results
              </h3>

              <div className="flex flex-col gap-6 mb-12">
                {[
                  { label: 'Dark Mode', color: 'bg-tertiary' },
                  { label: 'Anonymous Voting', color: 'bg-primary' },
                  { label: 'Zapier Integration', color: 'bg-secondary' },
                  { label: 'Custom Domains', color: 'bg-[#e85d8a]' }
                ].map((item, index) => {
                  const totalVotes = demoVotes.reduce((a,b) => a+b, 0);
                  const maxVotes = Math.max(...demoVotes);
                  const displayPercent = totalVotes === 0 ? 0 : Math.round((demoVotes[index] / totalVotes) * 100);
                  const width = maxVotes === 0 ? 0 : (demoVotes[index] / maxVotes) * 100;

                  return (
                    <div key={index} className="w-full">
                      <div className="flex justify-between text-sm mb-2 font-hanken-grotesk">
                        <span className="text-on-surface">
                          {item.label} {index === 0 && <span className="text-on-surface-variant text-xs">(wait, we have that)</span>}
                        </span>
                        <span className="font-jetbrains-mono text-on-surface-variant font-medium">{demoVotes[index]} ({displayPercent}%)</span>
                      </div>
                      <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden border border-outline-variant/10">
                        <div 
                          className={`h-full ${item.color} transition-all duration-1000 ease-out`}
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Leaderboard Mockup */}
              <h3 className="font-sora text-sm text-on-surface-variant mb-4 uppercase tracking-wider font-semibold">Fastest Voters</h3>
              <div className="flex flex-col gap-2">
                {[
                  { name: 'Alex M.', time: '0.8s', color: 'bg-[#FFD700]' },
                  { name: 'Sarah K.', time: '1.2s', color: 'bg-[#C0C0C0]' },
                  { name: 'David J.', time: '1.5s', color: 'bg-[#CD7F32]' }
                ].map((participant, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-surface-container-high border border-outline-variant/10">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-surface-container-lowest ${participant.color}`}>
                        {index + 1}
                      </div>
                      <span className="font-hanken-grotesk text-on-surface text-sm font-medium">{participant.name}</span>
                    </div>
                    <span className="font-jetbrains-mono text-tertiary text-xs">{participant.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: Stats Bar */}
      <section className="w-full relative z-10 glass-panel-elevated border-y border-outline-variant/20 py-16 px-5 mt-12 observe-me opacity-0">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="material-symbols-outlined text-tertiary">bolt</span>
              <span className="font-sora text-4xl md:text-5xl font-bold text-primary" style={{ textShadow: '0 0 15px rgba(218,194,175,0.3)' }}>10K+</span>
            </div>
            <p className="font-jetbrains-mono text-[10px] uppercase tracking-wider text-on-surface-variant">Polls Created</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary">bar_chart</span>
              <span className="font-sora text-4xl md:text-5xl font-bold text-primary" style={{ textShadow: '0 0 15px rgba(218,194,175,0.3)' }}>50K+</span>
            </div>
            <p className="font-jetbrains-mono text-[10px] uppercase tracking-wider text-on-surface-variant">Votes Cast</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="material-symbols-outlined text-tertiary">bolt</span>
              <span className="font-sora text-4xl md:text-5xl font-bold text-primary" style={{ textShadow: '0 0 15px rgba(218,194,175,0.3)' }}>99.9%</span>
            </div>
            <p className="font-jetbrains-mono text-[10px] uppercase tracking-wider text-on-surface-variant">Uptime</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="material-symbols-outlined text-secondary">emoji_events</span>
              <span className="font-sora text-4xl md:text-5xl font-bold text-primary" style={{ textShadow: '0 0 15px rgba(218,194,175,0.3)' }}>Live</span>
            </div>
            <p className="font-jetbrains-mono text-[10px] uppercase tracking-wider text-on-surface-variant">Results Delivery</p>
          </div>
        </div>
      </section>

      {/* SECTION 7: CTA Section */}
      <section className="w-full max-w-4xl mx-auto pt-32 pb-48 px-5 text-center relative observe-me opacity-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[400px] bg-tertiary/10 rounded-full blur-[100px] pointer-events-none" />
        
        <h2 className="text-4xl md:text-6xl font-sora font-bold text-on-surface mb-6 relative z-10">Ready to Go Live?</h2>
        <p className="text-lg md:text-xl text-on-surface-variant font-hanken-grotesk mb-10 max-w-xl mx-auto relative z-10">
          Create your first poll in under 2 minutes.<br />
          No credit card required.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
          <Button variant="primary" onClick={() => navigate('/auth')} className="w-full sm:w-auto bg-[#e85d8a] text-white hover:bg-[#e85d8a]/90 glow-active border-none px-8 py-4 text-lg">
            Start Polling Free
          </Button>
          <Button variant="ghost" onClick={() => navigate('/auth')} className="w-full sm:w-auto px-8 py-4 text-lg">
            Sign In
          </Button>
        </div>
      </section>

      {/* SECTION 8: Footer */}
      <footer className="w-full glass-panel border-t border-outline-variant/20 py-8 px-5 md:px-10 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="relative flex items-center gap-2">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-8 h-8 rounded-full bg-tertiary/20 animate-ping" />
                <div className="absolute w-8 h-8 rounded-full bg-tertiary/10 blur-sm" />
                <span
                  className="material-symbols-outlined relative z-10 text-tertiary"
                  style={{
                    fontVariationSettings: "'FILL' 1",
                    fontSize: '24px',
                    animation: 'electric-pulse 2s ease-in-out infinite',
                  }}
                >
                  bolt
                </span>
              </div>
              <span className="font-sora font-bold text-xl text-primary">
                PollSync
              </span>
            </div>
            <p className="text-sm text-on-surface-variant font-hanken-grotesk ml-8">Real-time data, grounded in earth.</p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-on-surface-variant font-hanken-grotesk">
            <button onClick={() => navigate('/dashboard')} className="hover:text-primary transition-colors">Dashboard</button>
            <button onClick={() => navigate('/poll/create')} className="hover:text-primary transition-colors">Create Poll</button>
            <button onClick={() => navigate('/auth')} className="hover:text-primary transition-colors">Sign In</button>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-outline-variant/10 text-center text-xs text-on-surface-variant/70 font-hanken-grotesk">
          © 2026 PollSync. Built for realtime engagement.
        </div>
      </footer>
    </div>
  );
}


