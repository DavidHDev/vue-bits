/**
 * Lightweight WebAudio sample player used by the hero's interactive code
 * editor. Sound files are expected at /sounds/*.mp3 in `static/`. If they
 * are missing the player silently no-ops.
 */

let _audioCtx: AudioContext | undefined;
const _buffers: Record<string, AudioBuffer> = {};
const _sounds: Record<string, string> = {
  tick: '/sounds/click-004.mp3',
  color: '/sounds/drop-003.mp3',
  toggle: '/sounds/switch-007.mp3'
};
const _lastPlayed: Record<string, number> = {};

export function preloadSounds(): void {
  if (typeof window === 'undefined' || _audioCtx) return;
  try {
    const Ctor =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    _audioCtx = new Ctor();
  } catch {
    return;
  }
  for (const [key, url] of Object.entries(_sounds)) {
    fetch(url)
      .then(r => (r.ok ? r.arrayBuffer() : Promise.reject()))
      .then(buf => _audioCtx!.decodeAudioData(buf))
      .then(decoded => {
        _buffers[key] = decoded;
      })
      .catch(() => {
        /* silent */
      });
  }
}

export function playSound(name: string, volume = 0.25, cooldown = 0): void {
  if (typeof window === 'undefined') return;
  if (!_audioCtx) preloadSounds();
  const buf = _buffers[name];
  if (!buf || !_audioCtx) return;
  if (cooldown > 0) {
    const now = performance.now();
    if (now - (_lastPlayed[name] || 0) < cooldown) return;
    _lastPlayed[name] = now;
  }
  const src = _audioCtx.createBufferSource();
  const gain = _audioCtx.createGain();
  gain.gain.value = volume;
  src.buffer = buf;
  src.connect(gain);
  gain.connect(_audioCtx.destination);
  src.start(0);
}
