import { useState } from 'react'
import { today } from '../utils/date'
import { ProgressRing } from './ProgressRing'
import { WeekDots } from './WeekDots'
import { LevelPicker } from './LevelPicker'

const HINTS = {
  beginner:
    'Feet shoulder-width, toes out 30–45°. Hold a doorframe for support — this is a starting point, not failure. Raise heels on a folded towel if needed. Hold 30–60 sec, rest 30 sec, repeat. Accumulate 7 min total. Each day try to reduce heel elevation by 2–3 mm.',
  intermediate:
    'Remove heel support. Feet turned out, hips fully below knees. Rest elbows inside knees and press outward (Malasana). Drop one knee toward floor, hold 5 sec, alternate. Practice standing up without using your hands. Shuffle left and right 10 paces staying low.',
  advanced:
    'Full squat, heels flat, no support — hold continuous 2–3 min blocks. Loaded squat with 10 kg kettlebell at chest. 3-sec down, 2-sec hold, 3-sec up tempo × 10 reps. Squat rotation: rotate torso left, reach right arm long, hold 5 sec per side.',
}

export const AsianSquat = ({ data, update }) => {
  const [open, setOpen] = useState(false)

  const mark = () => {
    if (data.done) return
    const days = data.days.includes(today()) ? data.days : [...data.days, today()]
    update({ done: true, days })
  }

  const setLevel = (level) => update({ level })

  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
      <button className="w-full text-left px-5 pt-5 pb-4" onClick={() => setOpen(o => !o)}>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">Daily · 7 min</span>
              {data.done && (
                <span className="text-[10px] font-bold tracking-wider text-[#00e676] uppercase">Done</span>
              )}
            </div>
            <h2 className="text-lg font-bold mt-0.5">Asian Squat</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Ankle mobility · hip flexors · spinal decompression</p>
          </div>
          <ProgressRing
            progress={data.done ? 1 : 0}
            size={64}
            sw={5}
            color={data.done ? '#00e676' : '#ff6b2b'}
          >
            <span className="text-lg">{data.done ? '✓' : '—'}</span>
          </ProgressRing>
        </div>
      </button>

      <div className="px-5 pb-5 space-y-4">
        <LevelPicker value={data.level} onChange={setLevel} />

        {open && (
          <p className="text-xs text-zinc-400 leading-relaxed">{HINTS[data.level]}</p>
        )}

        <div className="flex items-center justify-between">
          <WeekDots days={data.days} target={7} label=" days" />
          <button
            onClick={mark}
            disabled={data.done}
            className={`ml-4 px-5 py-3 rounded-xl text-sm font-bold transition-all active:scale-95 ${
              data.done
                ? 'bg-zinc-900 text-zinc-600'
                : 'bg-[#00e676]/10 border border-[#00e676]/30 text-[#00e676] active:bg-[#00e676]/20'
            }`}
          >
            {data.done ? 'Complete' : 'Mark Done'}
          </button>
        </div>
      </div>
    </div>
  )
}
