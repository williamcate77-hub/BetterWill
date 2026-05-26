import { useState, useEffect, useRef, useCallback } from 'react'
import { beepDone, unlockAudio, click } from '../utils/audio'

const fmt = (secs) => {
  const s = Math.max(0, Math.floor(secs))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

/**
 * Reusable countdown timer.
 * duration  – total seconds
 * onComplete – called when timer reaches zero
 * color     – progress bar / ring colour (hex string)
 */
export const CountdownTimer = ({ duration, onComplete, color = '#00e676' }) => {
  const [status, setStatus] = useState('idle') // idle | running | paused | done
  const startRef   = useRef(null)
  const elapsedRef = useRef(0)
  const [, setTick] = useState(0)

  const getElapsed = useCallback(() => {
    if (status === 'running' && startRef.current) {
      return elapsedRef.current + (Date.now() - startRef.current) / 1000
    }
    return elapsedRef.current
  }, [status])

  const elapsed   = Math.min(getElapsed(), duration)
  const remaining = Math.max(0, duration - elapsed)
  const progress  = elapsed / duration

  useEffect(() => {
    if (status !== 'running') return
    const iv = setInterval(() => {
      const el = elapsedRef.current + (Date.now() - startRef.current) / 1000
      if (el >= duration) {
        elapsedRef.current = duration
        setStatus('done')
        beepDone()
        onComplete?.()
        clearInterval(iv)
      }
      setTick(t => t + 1)
    }, 250)
    return () => clearInterval(iv)
  }, [status, duration, onComplete])

  // Reset when duration changes (level switch)
  useEffect(() => {
    elapsedRef.current = 0
    startRef.current = null
    setStatus('idle')
    setTick(0)
  }, [duration])

  const start = () => {
    unlockAudio()
    click()
    startRef.current = Date.now()
    setStatus('running')
  }

  const pause = () => {
    click()
    elapsedRef.current += (Date.now() - startRef.current) / 1000
    startRef.current = null
    setStatus('paused')
  }

  const reset = () => {
    click()
    elapsedRef.current = 0
    startRef.current = null
    setStatus('idle')
    setTick(0)
  }

  return (
    <div className="bg-zinc-900 rounded-xl p-4 space-y-3">
      {/* Time display */}
      <div className="text-center">
        <span
          className="text-5xl font-bold tabular-nums tracking-tight"
          style={{ color: status === 'done' ? color : '#ffffff' }}
        >
          {fmt(remaining)}
        </span>
        {status === 'done' && (
          <p className="text-xs mt-1" style={{ color }}>Complete! Great work.</p>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${progress * 100}%`,
            backgroundColor: color,
            transition: 'width 0.25s linear',
          }}
        />
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        {status === 'idle' && (
          <button
            onClick={start}
            className="flex-1 py-3 rounded-xl text-sm font-bold transition-all active:scale-95"
            style={{ background: `${color}18`, border: `1px solid ${color}50`, color }}
          >
            Start Timer
          </button>
        )}
        {status === 'running' && (
          <>
            <button
              onClick={pause}
              className="flex-1 py-3 rounded-xl text-sm font-bold bg-zinc-800 text-white transition-all active:scale-95"
            >
              Pause
            </button>
            <button
              onClick={reset}
              className="py-3 px-4 rounded-xl text-sm font-bold bg-zinc-900 text-zinc-500 transition-all active:scale-95"
            >
              Reset
            </button>
          </>
        )}
        {status === 'paused' && (
          <>
            <button
              onClick={start}
              className="flex-1 py-3 rounded-xl text-sm font-bold transition-all active:scale-95"
              style={{ background: `${color}18`, border: `1px solid ${color}50`, color }}
            >
              Resume
            </button>
            <button
              onClick={reset}
              className="py-3 px-4 rounded-xl text-sm font-bold bg-zinc-900 text-zinc-500 transition-all active:scale-95"
            >
              Reset
            </button>
          </>
        )}
        {status === 'done' && (
          <button
            onClick={reset}
            className="flex-1 py-3 rounded-xl text-sm font-bold bg-zinc-800 text-white transition-all active:scale-95"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  )
}
