let ctx = null

const getCtx = () => {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)()
    // Mix with Spotify / other audio on iOS 16.4+
    if ('audioSession' in navigator) {
      navigator.audioSession.type = 'ambient'
    }
  }
  return ctx
}

const tone = (freq, dur, vol = 0.5) => {
  try {
    const ac = getCtx()
    if (ac.state === 'suspended') ac.resume()
    const osc = ac.createOscillator()
    const gain = ac.createGain()
    osc.connect(gain)
    gain.connect(ac.destination)
    osc.frequency.value = freq
    osc.type = 'sine'
    gain.gain.setValueAtTime(vol, ac.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur)
    osc.start(ac.currentTime)
    osc.stop(ac.currentTime + dur)
  } catch { /* audio not available */ }
}

// Subtle UI click — plays on every button press
export const click = () => tone(1100, 0.06, 0.25)

// Short single confirm beep
export const beep = () => tone(880, 0.35, 0.5)

// Two rising tones — slow→fast transition
export const beepFast = () => {
  tone(660, 0.25, 0.5)
  setTimeout(() => tone(1100, 0.3, 0.55), 280)
}

// Two falling tones — fast→slow transition
export const beepSlow = () => {
  tone(1100, 0.25, 0.5)
  setTimeout(() => tone(660, 0.3, 0.45), 280)
}

// Triple rising tones — session complete
export const beepDone = () => {
  tone(880, 0.2, 0.5)
  setTimeout(() => tone(1100, 0.2, 0.5), 220)
  setTimeout(() => tone(1320, 0.35, 0.6), 440)
}

// Unlock audio context on first user gesture (call on touchstart/click)
export const unlockAudio = () => {
  try {
    const ac = getCtx()
    if (ac.state === 'suspended') ac.resume()
  } catch { /* noop */ }
}
