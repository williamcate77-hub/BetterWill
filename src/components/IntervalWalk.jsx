import { useState, useEffect, useRef, useCallback } from 'react'
import { today, weekDays } from '../utils/date'
import { beepFast, beepSlow, beepDone, click, unlockAudio } from '../utils/audio'
import { getUrgency, URGENCY } from '../utils/urgency'
import { WeekDots } from './WeekDots'
import { ResetButton } from './ResetButton'

// 10 phases × 3 min = 30 min, starting slow
// [slow, fast, slow, fast, slow, fast, slow, fast, slow, fast]
const TOTAL_SECS  = 1800
const PHASE_SECS  = 180
const NUM_PHASES  = 10
const WEEKLY_TARGET = 4

const isSlowPhase = (i) => i % 2 === 0
const fmt = (secs) => {
  const s = Math.max(0, Math.floor(secs))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

export const IntervalWalk = ({ data, update }) => {
  const [status, setStatus]     = useState('idle') // idle | running | paused | done
  const startTimeRef            = useRef(null)
  const pausedElapsedRef        = useRef(0)
  const prevPhaseRef            = useRef(0)
  const [, setTick]             = useState(0)

  const wd = weekDays()
  const weeklyCount = data.days.filter(d => wd.includes(d)).length
  const urgency = getUrgency(data.days, WEEKLY_TARGET)
  const u = URGENCY[weeklyCount >= WEEKLY_TARGET ? 'done' : urgency]

  const getElapsed = useCallback(() => {
    if (status === 'running' && startTimeRef.current) {
      return pausedElapsedRef.current + (Date.now() - startTimeRef.current) / 1000
    }
    return pausedElapsedRef.current
  }, [status])

  const elapsed        = Math.min(getElapsed(), TOTAL_SECS)
  const remaining      = TOTAL_SECS - elapsed
  const phaseElapsed   = elapsed % PHASE_SECS
  const phaseRemaining = PHASE_SECS - phaseElapsed
  const currentPhase   = Math.min(Math.floor(elapsed / PHASE_SECS), NUM_PHASES - 1)
  const slow           = isSlowPhase(currentPhase)
  const phaseColor     = slow ? '#00e676' : '#ef4444'

  // Tick + beep detection
  useEffect(() => {
    if (status !== 'running') return
    const iv = setInterval(() => {
      const el = pausedElapsedRef.current + (Date.now() - startTimeRef.current) / 1000

      // Phase transition?
      const newPhase = Math.min(Math.floor(el / PHASE_SECS), NUM_PHASES - 1)
      if (newPhase > prevPhaseRef.current && el < TOTAL_SECS) {
        prevPhaseRef.current = newPhase
        if (isSlowPhase(newPhase)) beepSlow()
        else beepFast()
      }

      // Done?
      if (el >= TOTAL_SECS) {
        pausedElapsedRef.current = TOTAL_SECS
        setStatus('done')
        beepDone()
        const days = data.days.includes(today()) ? data.days : [...data.days, today()]
        update({ days })
        clearInterval(iv)
      }

      setTick(t => t + 1)
    }, 250)
    return () => clearInterval(iv)
  }, [status, data.days, update])

  const start = () => {
    // MUST call unlockAudio inside a user-gesture handler to unblock iOS AudioContext
    unlockAudio()
    click()
    prevPhaseRef.current = Math.min(Math.floor(pausedElapsedRef.current / PHASE_SECS), NUM_PHASES - 1)
    startTimeRef.current = Date.now()
    setStatus('running')
  }

  const pause = () => {
    click()
    pausedElapsedRef.current += (Date.now() - startTimeRef.current) / 1000
    startTimeRef.current = null
    setStatus('paused')
  }

  const stop = () => {
    click()
    pausedElapsedRef.current = 0
    startTimeRef.current = null
    prevPhaseRef.current = 0
    setStatus('idle')
    setTick(0)
  }

  const canReset = status === 'idle' && data.days.includes(today())
  const resetToday = () => update({ days: data.days.filter(d => d !== today()) })

  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">
                4×/week · 30 min
              </span>
              {weeklyCount >= WEEKLY_TARGET && (
                <span className="text-[10px] font-bold tracking-wider text-[#00e676] uppercase">Done ✓</span>
              )}
              {weeklyCount < WEEKLY_TARGET && urgency !== 'normal' && (
                <span className={`text-[10px] font-bold tracking-wider uppercase ${u.label}`}>
                  {urgency === 'critical' ? 'Critical' : urgency === 'urgent' ? 'Urgent' : 'Behind'}
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold mt-0.5">Interval Walk</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Japanese protocol · 3 min slow / 3 min fast</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold" style={{ color: weeklyCount >= WEEKLY_TARGET ? '#00e676' : u.ring }}>
              {weeklyCount}
            </span>
            <span className="text-[10px] text-zinc-600">/{WEEKLY_TARGET} wk</span>
          </div>
        </div>
      </div>

      {/* Active timer display */}
      {status !== 'idle' && (
        <div className="mx-5 mb-4 bg-zinc-900 rounded-xl p-5 space-y-4">
          {/* Phase label */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background: status === 'done' ? '#00e676' : phaseColor,
                  boxShadow: status === 'running' ? `0 0 8px ${phaseColor}` : 'none',
                }}
              />
              <span className="text-xs font-bold tracking-widest" style={{ color: status === 'done' ? '#00e676' : phaseColor }}>
                {status === 'done' ? 'SESSION COMPLETE' : `${slow ? 'SLOW' : 'FAST'} WALK`}
              </span>
            </div>
            <span className="text-xs text-zinc-600">
              {status === 'done' ? '10/10' : `${currentPhase + 1}/10`}
            </span>
          </div>

          {/* Main countdown */}
          <div className="text-center">
            <span className="text-5xl font-bold tabular-nums tracking-tight">
              {fmt(status === 'done' ? 0 : remaining)}
            </span>
            <p className="text-xs text-zinc-600 mt-1">total remaining</p>
          </div>

          {/* Phase countdown + bar */}
          {status !== 'done' && (
            <div>
              <div className="flex justify-between text-[10px] text-zinc-600 mb-1.5">
                <span>Phase remaining</span>
                <span style={{ color: phaseColor }}>{fmt(phaseRemaining)}</span>
              </div>
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(phaseElapsed / PHASE_SECS) * 100}%`,
                    background: phaseColor,
                    transition: 'width 0.25s linear, background 0.5s ease',
                  }}
                />
              </div>
            </div>
          )}

          {/* Interval dots */}
          <div>
            <div className="flex gap-1">
              {Array.from({ length: NUM_PHASES }).map((_, i) => {
                const done   = status === 'done' || i < currentPhase
                const active = i === currentPhase && status !== 'done'
                const color  = isSlowPhase(i) ? '#00e676' : '#ef4444'
                return (
                  <div
                    key={i}
                    className="h-1.5 flex-1 rounded-full"
                    style={{
                      background: done ? `${color}70` : active ? color : '#27272a',
                    }}
                  />
                )
              })}
            </div>
            <div className="flex justify-between text-[9px] text-zinc-700 mt-1 px-0.5">
              {['S','F','S','F','S','F','S','F','S','F'].map((l, i) => (
                <span key={i}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="px-5 pb-5 space-y-3">
        <div className="flex gap-2">
          {status === 'idle' && (
            <button
              onClick={start}
              className="flex-1 py-3.5 rounded-xl text-sm font-bold transition-all active:scale-95"
              style={{ background: `${u.ring}18`, border: `1px solid ${u.ring}50`, color: u.ring }}
            >
              Start 30-Min Timer
            </button>
          )}
          {status === 'running' && (
            <>
              <button onClick={pause} className="flex-1 py-3.5 rounded-xl text-sm font-bold bg-zinc-800 text-white transition-all active:scale-95">
                Pause
              </button>
              <button onClick={stop} className="py-3.5 px-4 rounded-xl text-sm font-bold bg-zinc-900 text-zinc-500 transition-all active:scale-95">
                Stop
              </button>
            </>
          )}
          {status === 'paused' && (
            <>
              <button onClick={start} className="flex-1 py-3.5 rounded-xl text-sm font-bold transition-all active:scale-95"
                style={{ background: `${u.ring}18`, border: `1px solid ${u.ring}50`, color: u.ring }}>
                Resume
              </button>
              <button onClick={stop} className="py-3.5 px-4 rounded-xl text-sm font-bold bg-zinc-900 text-zinc-500 transition-all active:scale-95">
                Stop
              </button>
            </>
          )}
          {status === 'done' && (
            <button onClick={stop} className="flex-1 py-3.5 rounded-xl text-sm font-bold bg-zinc-800 text-white transition-all active:scale-95">
              Done — Reset
            </button>
          )}
        </div>

        <div className="flex items-center justify-between">
          <WeekDots days={data.days} target={WEEKLY_TARGET} label="/week" />
          {status === 'running' && (
            <span className="text-[10px] text-zinc-700">Keep screen on for beeps</span>
          )}
          {canReset && <ResetButton onReset={resetToday} />}
        </div>
      </div>
    </div>
  )
}
