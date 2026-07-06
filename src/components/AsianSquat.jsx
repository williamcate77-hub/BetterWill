import { useState, useCallback } from 'react'
import { today } from '../utils/date'
import { click } from '../utils/audio'
import { getUrgency, URGENCY } from '../utils/urgency'
import { ProgressRing } from './ProgressRing'
import { WeekDots } from './WeekDots'
import { LevelPicker } from './LevelPicker'
import { CountdownTimer } from './CountdownTimer'
import { ResetButton } from './ResetButton'

// Timer duration per level in seconds
const TIMER = { beginner: 180, intermediate: 420, advanced: 420 }

const HINTS = {
  beginner:
    'Feet shoulder-width, toes out 30–45°. Hold a doorframe for support. If heels lift, place a folded towel under each heel — this is a starting point, not failure. Hold 30–60 sec, rest 30 sec, repeat to accumulate 3 min. Each day try to reduce heel elevation by 2–3 mm.',
  intermediate:
    'Remove heel support. Feet turned out, hips fully below knees. Rest elbows inside knees and press outward (Malasana). Drop one knee toward floor, hold 5 sec, alternate. Practice standing up without hands. Shuffle left and right 10 paces staying low. 7 min total.',
  advanced:
    'Full squat, heels flat, no support — continuous 2–3 min blocks. Loaded squat with 10 kg kettlebell at chest. 3-sec down, 2-sec hold, 3-sec up × 10 reps. Squat rotation: rotate torso left, reach right arm long, hold 5 sec per side. 7 min total.',
}

export const AsianSquat = ({ data, update }) => {
  const [open, setOpen] = useState(false)
  const urgency = getUrgency(data.days, 7)
  const u = URGENCY[data.done ? 'done' : urgency]
  const duration = TIMER[data.level]

  const onTimerComplete = useCallback(() => {
    if (data.done) return
    const days = data.days.includes(today()) ? data.days : [...data.days, today()]
    update({ done: true, days })
  }, [data.done, data.days, update])

  const mark = () => {
    if (data.done) return
    click()
    const days = data.days.includes(today()) ? data.days : [...data.days, today()]
    update({ done: true, days })
  }

  const setLevel = (level) => { click(); update({ level }) }

  const canReset = data.done || data.days.includes(today())
  const reset = () => update({ done: false, days: data.days.filter(d => d !== today()) })

  const timerLabel = { beginner: '3 min', intermediate: '7 min', advanced: '7 min' }

  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
      <button className="w-full text-left px-5 pt-5 pb-4" onClick={() => { click(); setOpen(o => !o) }}>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">
                Daily · {timerLabel[data.level]}
              </span>
              {data.done && <span className="text-[10px] font-bold tracking-wider text-[#00e676] uppercase">Done ✓</span>}
              {!data.done && urgency !== 'normal' && (
                <span className={`text-[10px] font-bold tracking-wider uppercase ${u.label}`}>
                  {urgency === 'critical' ? 'Critical' : urgency === 'urgent' ? 'Urgent' : 'Behind'}
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold mt-0.5">Asian Squat</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Ankle mobility · hip flexors · spinal decompression</p>
          </div>
          <ProgressRing progress={data.done ? 1 : 0} size={64} sw={5} color={u.ring}>
            <span className="text-lg" style={{ color: u.ring }}>{data.done ? '✓' : '—'}</span>
          </ProgressRing>
        </div>
      </button>

      <div className="px-5 pb-5 space-y-4">
        <LevelPicker value={data.level} onChange={setLevel} />

        {open && <p className="text-xs text-zinc-400 leading-relaxed">{HINTS[data.level]}</p>}

        {/* Countdown timer */}
        {!data.done && (
          <CountdownTimer
            key={data.level}
            duration={duration}
            onComplete={onTimerComplete}
            color={u.ring}
          />
        )}

        <div className="flex items-center justify-between">
          <WeekDots days={data.days} target={7} label=" days" />
          <div className="ml-4 flex items-center gap-2">
            {canReset && <ResetButton onReset={reset} />}
            <button
              onClick={mark}
              disabled={data.done}
              className="px-5 py-3 rounded-xl text-sm font-bold transition-all active:scale-95"
              style={data.done
                ? { background: '#18181b', color: '#52525b' }
                : { background: `${u.ring}18`, border: `1px solid ${u.ring}50`, color: u.ring }
              }
            >
              {data.done ? 'Complete' : 'Mark Done'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
