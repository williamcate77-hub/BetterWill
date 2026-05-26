import { useState } from 'react'
import { today } from '../utils/date'
import { ProgressRing } from './ProgressRing'
import { WeekDots } from './WeekDots'
import { LevelPicker } from './LevelPicker'

const CFG = {
  beginner: {
    target: 12,
    tapLabel: 'Log 10 sec',
    unit: '10-sec hangs',
    totalLabel: '2 min total',
    hint: '3 sets of 10–20 sec hangs. Stand on a step for confidence. Palms away, shoulder-width. Step off and let gravity lengthen your spine. Breathe slowly — do not hold tension in your shoulders.',
  },
  intermediate: {
    target: 3,
    tapLabel: 'Log Set',
    unit: 'sets',
    totalLabel: '3 sets × 30–45 sec',
    hint: 'Passive hang for 15 sec, then actively depress and retract scapulae (pull shoulders down and back). Add single-arm shift: 70% weight to one arm for 5 sec. Introduce gentle thoracic rotation mid-hang.',
  },
  advanced: {
    target: 4,
    tapLabel: 'Log Set',
    unit: 'sets',
    totalLabel: '4 sets × 60 sec',
    hint: 'Single-arm dead hang 10–15 sec per side. Scapular pull-ups: retract scapulae to lift body 5–8 cm, 8–10 reps. L-sit hang: lift knees to hip height, hold 10 sec. Slow leg raises: 90°, hold 2 sec, lower with control.',
  },
}

export const BarHangs = ({ data, update }) => {
  const [open, setOpen] = useState(false)
  const cfg = CFG[data.level]
  const isComplete = data.taps >= cfg.target
  const progress = data.taps / cfg.target

  const tap = () => {
    if (isComplete) return
    const newTaps = data.taps + 1
    const nowComplete = newTaps >= cfg.target
    const days = nowComplete && !data.days.includes(today())
      ? [...data.days, today()]
      : data.days
    update({ taps: newTaps, days })
  }

  const setLevel = (level) => {
    update({ level, taps: 0 })
  }

  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
      <button className="w-full text-left px-5 pt-5 pb-4" onClick={() => setOpen(o => !o)}>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">Daily</span>
              {isComplete && (
                <span className="text-[10px] font-bold tracking-wider text-[#00e676] uppercase">Done</span>
              )}
            </div>
            <h2 className="text-lg font-bold mt-0.5">Bar Hangs</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              {data.taps}/{cfg.target} {cfg.unit} · {cfg.totalLabel}
            </p>
          </div>
          <ProgressRing
            progress={progress}
            size={64}
            sw={5}
            color={isComplete ? '#00e676' : '#ff6b2b'}
          >
            <span className={`text-sm font-bold ${isComplete ? 'text-[#00e676]' : 'text-white'}`}>
              {data.taps}
            </span>
          </ProgressRing>
        </div>
      </button>

      <div className="px-5 pb-5 space-y-4">
        <LevelPicker value={data.level} onChange={setLevel} />

        {open && (
          <p className="text-xs text-zinc-400 leading-relaxed">{cfg.hint}</p>
        )}

        <div className="flex items-center justify-between">
          <WeekDots days={data.days} target={7} label=" days" />
          <button
            onClick={tap}
            disabled={isComplete}
            className={`ml-4 px-5 py-3 rounded-xl text-sm font-bold transition-all active:scale-95 ${
              isComplete
                ? 'bg-zinc-900 text-zinc-600'
                : 'bg-[#00e676]/10 border border-[#00e676]/30 text-[#00e676] active:bg-[#00e676]/20'
            }`}
          >
            {isComplete ? 'Complete' : cfg.tapLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
