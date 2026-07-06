import { useState } from 'react'
import { today } from '../utils/date'
import { click } from '../utils/audio'
import { getUrgency, URGENCY } from '../utils/urgency'
import { ProgressRing } from './ProgressRing'
import { WeekDots } from './WeekDots'
import { LevelPicker } from './LevelPicker'
import { ResetButton } from './ResetButton'

const CFG = {
  beginner: {
    target: 10,
    tapLabel: '+10 sec',
    unit: '10-sec hangs',
    totalLabel: '10 × 10 sec',
    hint: '10 hangs of 10 seconds each. Stand on a step for confidence. Grip the bar palms-away, shoulder-width. Step off and let gravity lengthen your spine — do not hold tension in your shoulders. Breathe slowly. Step back on if grip fails. Progress by adding 5 sec per hang each week.',
  },
  intermediate: {
    target: 3,
    tapLabel: 'Log Set',
    unit: 'sets',
    totalLabel: '3 sets × 30–45 sec',
    hint: 'Passive hang for 15 sec, then actively depress and retract scapulae (pull shoulders down and back) without bending elbows. Alternate passive and active. Add single-arm shift: 70% weight to one arm for 5 sec. Introduce gentle thoracic rotation mid-hang.',
  },
  advanced: {
    target: 4,
    tapLabel: 'Log Set',
    unit: 'sets',
    totalLabel: '4 sets × 60 sec',
    hint: 'Single-arm dead hang 10–15 sec per side. Scapular pull-ups: retract scapulae to lift body 5–8 cm without bending elbows, 8–10 reps. L-sit hang: lift knees to hip height, hold 10 sec. Slow leg raises: 90°, hold 2 sec, lower with control. Repeat 8 reps.',
  },
}

export const BarHangs = ({ data, update }) => {
  const [open, setOpen] = useState(false)
  const cfg = CFG[data.level]
  const isComplete = data.taps >= cfg.target
  const urgency = getUrgency(data.days, 7)
  const u = URGENCY[isComplete ? 'done' : urgency]

  const tap = () => {
    if (isComplete) return
    click()
    const newTaps = data.taps + 1
    const nowComplete = newTaps >= cfg.target
    const days = nowComplete && !data.days.includes(today())
      ? [...data.days, today()]
      : data.days
    update({ taps: newTaps, days })
  }

  const setLevel = (level) => { click(); update({ level, taps: 0 }) }

  const canReset = data.taps > 0 || data.days.includes(today())
  const reset = () => update({ taps: 0, days: data.days.filter(d => d !== today()) })

  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
      <button className="w-full text-left px-5 pt-5 pb-4" onClick={() => { click(); setOpen(o => !o) }}>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">Daily</span>
              {isComplete && <span className="text-[10px] font-bold tracking-wider text-[#00e676] uppercase">Done ✓</span>}
              {!isComplete && urgency !== 'normal' && (
                <span className={`text-[10px] font-bold tracking-wider uppercase ${u.label}`}>
                  {urgency === 'critical' ? 'Critical' : urgency === 'urgent' ? 'Urgent' : 'Behind'}
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold mt-0.5">Bar Hangs</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              {data.taps}/{cfg.target} {cfg.unit} · {cfg.totalLabel}
            </p>
          </div>
          <ProgressRing progress={data.taps / cfg.target} size={64} sw={5} color={u.ring}>
            <span className="text-sm font-bold" style={{ color: u.ring }}>{data.taps}</span>
          </ProgressRing>
        </div>
      </button>

      <div className="px-5 pb-5 space-y-4">
        <LevelPicker value={data.level} onChange={setLevel} />
        {open && <p className="text-xs text-zinc-400 leading-relaxed">{cfg.hint}</p>}
        <div className="flex items-center justify-between">
          <WeekDots days={data.days} target={7} label=" days" />
          <div className="ml-4 flex items-center gap-2">
            {canReset && <ResetButton onReset={reset} />}
            <button
              onClick={tap}
              disabled={isComplete}
              className="px-5 py-3 rounded-xl text-sm font-bold transition-all active:scale-95"
              style={isComplete
                ? { background: '#18181b', color: '#52525b' }
                : { background: `${u.ring}18`, border: `1px solid ${u.ring}50`, color: u.ring }
              }
            >
              {isComplete ? 'Complete' : cfg.tapLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
