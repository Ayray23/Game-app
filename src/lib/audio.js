const AudioContextClass = window.AudioContext || window.webkitAudioContext;
let ctx;

function getContext() {
  if (!ctx) ctx = new AudioContextClass();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(frequency, duration = 0.08, type = 'sine', volume = 0.045, delay = 0) {
  try {
    const audio = getContext();
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    const start = audio.currentTime + delay;
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  } catch {
    // Browsers can block audio until the user interacts with the page.
  }
}

export const sounds = {
  click: () => tone(420, 0.06),
  move: () => tone(560, 0.08, 'square', 0.035),
  join: () => { tone(520, 0.08); tone(760, 0.12, 'sine', 0.04, 0.08); },
  message: () => tone(680, 0.07, 'sine', 0.03),
  win: () => { tone(660, 0.12); tone(880, 0.16, 'sine', 0.045, 0.12); tone(1040, 0.22, 'sine', 0.05, 0.28); },
  draw: () => { tone(430, 0.12); tone(350, 0.18, 'sine', 0.035, 0.12); },
  timeout: () => { tone(260, 0.12, 'sawtooth', 0.03); tone(190, 0.18, 'sawtooth', 0.025, 0.12); },
};
