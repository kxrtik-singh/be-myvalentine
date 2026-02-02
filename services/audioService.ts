// Simple synthesized sounds using Web Audio API to avoid external asset dependencies
// This ensures sounds load instantly and work offline

const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
let audioCtx: AudioContext | null = null;

const getContext = () => {
  if (!audioCtx) {
    audioCtx = new AudioContextClass();
  }
  return audioCtx;
};

const resumeContext = () => {
  const ctx = getContext();
  if (ctx.state === 'suspended') {
    ctx.resume().catch(e => console.error("Audio resume failed", e));
  }
  return ctx;
};

// A playful "pop" sound for when the button moves
export const playPopSound = () => {
  try {
    const ctx = resumeContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    // Rapid frequency sweep up
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.1);

    // Quick volume envelope
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    // Ignore audio errors (e.g. if user hasn't interacted yet)
  }
};

// A gentle "ding" for clicking buttons
export const playClickSound = () => {
  try {
    const ctx = resumeContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  } catch (e) {
  }
};

// A joyful major arpeggio for the success screen
export const playCelebrationSound = () => {
  try {
    const ctx = resumeContext();
    // C Major Arpeggio: C, E, G, C, E
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      const startTime = ctx.currentTime + (i * 0.12);
      const duration = 0.4;
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.1, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  } catch (e) {
  }
};