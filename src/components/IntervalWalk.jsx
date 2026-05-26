import { useState, useEffect, useRef, useCallback } from 'react'
import { today } from '../utils/date'
import { weekDays } from '../utils/date'
import { beepFast, beepSlow, beepDone } from '../utils/audio'
import { WeekDots } from './WeekDots'

// 10 phases × 3 min = 30 min, starting slow
const TOTAL_SECS = 1800
const PHASE_SECS = 180
const NUM_PHASES = 10
// phase index 0,2,4,6,8 = slow; 1,3,5,7,9 = fast
const phaseName = (i) => (i % 2 === 0 ? 'SLOW' : 'FAST')
const WEEKLY_TARGET = 4

const fmt = (secs) => {
  const s = Math.max(0, Math.floor(secs))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

export const IntervalWalk = ({ data, update }) => {
  const [status, setStatus] = useState('idle') // idle | running | paused | done
  const startTimeRef = useRef(null)      // Date.now() when last resumed
  const pausedElapsedRef = useRef(0)     // accumulated seconds before last pause
  const prevPhaseRef = useRef(0)
  const [, setTick] = useState(0)        // force re-render

  const wd = weekDays()
  const weeklyCount = data.days.filter(d => wd.includes(d)).length

  const getElapsed = useCallback(() => {
    if (status === 'running' && startTimeRef.current) {
      return pausedElapsedRef.current + (Date.now() - startTimeRef.current) / 1000
    }
    return pausedElapsedRef.current
  }, [status])

  const elapsed = getElapsed()
  const clampedElapsed = Math.min(elapsed, TOTAL_SECS)
  const remaining = TOTAL_SECS - clampedElapsed
  const phaseElapsed = clampedElapsed % PHASE_SECS
  const phaseRemaining = PHASE_SECS - phaseElapsed
  const currentPhase = Math.min(Math.floor(clampedElapsed / PHASE_SECS), NUM_PHASES - 1)
  const phase = phaseName(currentPhase)
  const phaseProgress = phaseElapsed / PHASE_SECS
  const totalProgress = clampedElapsed / TOTAL_SECS

  // Tick and beep detection
  useEffect(() => {
    if (status !== 'running') return
    const interval = setInterval(() => {
      const el = pausedElapsedRef.current + (Date.now() - startTimeRef.current) / 1000

      // Detect phase transition
      const newPhase = Math.min(Math.floor(el / PHASE_SECS), NUM_PHASES - 1)
      if (newPhase > prevPhaseRef.current && el < TOTAL_SECS) {
        prevPhaseRef.current = newPhase
        if (phaseName(newPhase) === 'FAST') beepFast()
        else beepSlow()
      }

      // Detect completion
      if (el >= TOTAL_SECS) {
        pausedElapsedRef.current = TOTAL_SECS
        setStatus('done')
        beepDone()
        const days = data.days.includes(today()) ? data.days : [...data.days, today()]
        update({ days })
        clearInterval(interval)
      }

      setTick(t => t + 1)
    }, 500)
    return () => clearInterval(interval)
  }, [status, data.days, update])

  const start = () => {
    prevPhaseRef.current = Math.min(Math.floor(pausedElapsedRef.current / PHASE_SECS), NUM_PHASES - 1)
    startTimeRef.current = Date.now()
    setStatus('running')
  }

  const pause = () => {
    pausedElapsedRef.current += (Date.now() - startTimeRef.current) / 1000
    startTimeRef.current = null
    setStatus('paused')
  }

  const stop = () => {
    pausedElapsedRef.current = 0
    startTimeRef.current = null
    prevPhaseRef.current = 0
    setStatus('idle')
    setTick(0)
  }

  const isFast = phase === 'FAST'
  const phaseColor = isFast ? '#ff4444' : '#00e676'
  const phaseColorClass = isFast ? 'text-[#ff4444]' : 'text-[#00e676]'

  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">
              4×/week · 30 min
            </span>
            <h2 className="text-lg font-bold mt-0.5">Interval Walk</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Japanese protocol · 3 min slow / 3 min fast</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className={`text-xs font-bold tracking-widest ${weeklyCount >= WEEKLY_TARGET ? 'text-[#00e676]' : 'text-zinc-500'}`}>
              {weeklyCount}/{WEEKLY_TARGET} wk
            </span>
          </div>
        </div>
      </div>

      {/* Timer display — only shown when active */}
      {status !== 'idle' && (
        <div className="mx-5 mb-4 bg-zinc-900 rounded-xl p-5">
          {/* Phase label */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${status === 'running' ? (isFast ? 'bg-[#ff4444]' : 'bg-[#00e676]') : 'bg-zinc-600'} ${status === 'running' ? 'animate-pulse' : ''}`} />
              <span className={`text-xs font-bold tracking-widest ${status === 'done' ? 'text-[#00e676]' : phaseColorClass}`}>
                {status === 'done' ? 'COMPLETE' : `${phase} WALK`}
              </span>
            </div>
            <span className="text-xs text-zinc-600">
              {status === 'done' ? '10/10' : `${currentPhase + 1}/10`}
            </span>
          </div>

          {/* Main time */}
          <div className="text-center mb-4">
            <span className="text-5xl font-bold tabular-nums tracking-tight">
              {fmt(status === 'done' ? 0 : remaining)}
            </span>
            <p className="text-xs text-zinc-600 mt-1">total remaining</p>
          </div>

          {/* Phase timer */}
          {status !== 'done' && (
            <div className="mb-4">
              <div className="flex justify-between text-[10px] text-zinc-600 mb-1">
                <span>Phase time</span>
                <span className={phaseColorClass}>{fmt(phaseRemaining)}</span>
              </div>
              <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${phaseProgress * 100}%`,
                    backgroundColor: phaseColor,
                    transition: 'width 0.5s linear, background-color 0.5s ease',
                  }}
                />
              </div>
            </div>
          )}

          {/* Interval dots */}
          <div className="flex gap-1 justify-center">
            {Array.from({ length: NUM_PHASES }).map((_, i) => {
              const done = status === 'done' || i < currentPhase
              const active = i === currentPhase && status !== 'done'
              const isFastPhase = i % 2 !== 0
              return (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    done
                      ? isFastPhase ? 'bg-[#ff4444]/60' : 'bg-[#00e676]/60'
                      : active
                      ? isFastPhase ? 'bg-[#ff4444]' : 'bg-[#00e676]'
                      : 'bg-zinc-800'
                  }`}
                />
              )
            })}
          </div>
          <div className="flex justify-between text-[9px] text-zinc-700 mt-1">
            <span>Slow</span>
            <span>Fast</span>
            <span>Slow</span>
            <span>Fast</span>
            <span>Slow</span>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="px-5 pb-5 space-y-3">
        <div className="flex gap-2">
          {status === 'idle' && (
            <button
              onClick={start}
              className="flex-1 py-3.5 rounded-xl text-sm font-bold bg-[#00e676]/10 border border-[#00e676]/30 text-[#00e676] active:scale-95 transition-all active:bg-[#00e676]/20"
            >
              Start 30-Min Timer
            </button>
          )}
          {status === 'running' && (
            <>
              <button
                onClick={pause}
                className="flex-1 py-3.5 rounded-xl text-sm font-bold bg-zinc-800 text-white active:scale-95 transition-all"
              >
                Pause
              </button>
              <button
                onClick={stop}
                className="py-3.5 px-4 rounded-xl text-sm font-bold bg-zinc-900 text-zinc-500 active:scale-95 transition-all"
              >
                Stop
              </button>
            </>
          )}
          {status === 'paused' && (
            <>
              <button
                onClick={start}
                className="flex-1 py-3.5 rounded-xl text-sm font-bold bg-[#00e676]/10 border border-[#00e676]/30 text-[#00e676] active:scale-95 transition-all active:bg-[#00e676]/20"
              >
                Resume
              </button>
              <button
                onClick={stop}
                className="py-3.5 px-4 rounded-xl text-sm font-bold bg-zinc-900 text-zinc-500 active:scale-95 transition-all"
              >
                Stop
              </button>
            </>
          )}
          {status === 'done' && (
            <button
              onClick={stop}
              className="flex-1 py-3.5 rounded-xl text-sm font-bold bg-zinc-800 text-white active:scale-95 transition-all"
            >
              Done — Reset
            </button>
          )}
        </div>

        {status === 'idle' && (
          <div className="flex items-center justify-between">
            <WeekDots days={data.days} target={WEEKLY_TARGET} label="/week" />
          </div>
        )}

        {status !== 'idle' && (
          <div className="flex items-center justify-between">
            <WeekDots days={data.days} target={WEEKLY_TARGET} label="/week" />
            {status === 'running' && (
              <span className="text-[10px] text-zinc-600">Keep screen on for beeps</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
