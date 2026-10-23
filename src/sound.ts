const muted = () => localStorage.getItem('meadowbell-muted') === 'true';
let context: AudioContext | null = null;
let unlocked = false;
const patterns: Record<string, number[]> = {
  'login-success': [523, 659, 784], 'login-error': [220, 185], click: [660],
  'popup-open': [440, 587], 'popup-close': [587, 392], success: [587, 740, 880], cancel: [440, 349, 294],
};
function unlock() {
  if (unlocked) return;
  context ??= new AudioContext();
  if (context.state === 'suspended') void context.resume();
  unlocked = true;
}
if (typeof window !== 'undefined') window.addEventListener('pointerdown', unlock, { once: true });
export function playSound(name: string, disabled = muted()) {
  if (disabled || typeof window === 'undefined') return;
  unlock();
  context ??= new AudioContext();
  const notes = patterns[name] || patterns.click;
  notes.forEach((frequency, index) => {
    const start = context!.currentTime + index * (name === 'click' ? 0 : 0.095);
    const oscillator = context!.createOscillator();
    const gain = context!.createGain();
    oscillator.type = name === 'login-error' ? 'sine' : 'sine';
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(name === 'click' ? 0.045 : 0.075, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + (name === 'click' ? 0.09 : 0.34));
    oscillator.connect(gain); gain.connect(context!.destination);
    oscillator.start(start); oscillator.stop(start + 0.36);
  });
}
