import { useState } from 'react'
import { today } from '../utils/date'
import { ProgressRing } from './ProgressRing'
import { WeekDots } from './WeekDots'
import { LevelPicker } from './LevelPicker'

const HINTS = {
  beginner:
    '3 reps per side. Start in tall plank. Step right foot outside right hand. Drop back knee to floor (kneeling lunge). Hands inside front foot — hold 5 sec. Lift right hand, rotate torso right reaching to ceiling — hold 3 sec. Push hips back, straighten front leg for hamstring stretch — hold 5 sec. Repeat left side.',
  intermediate:
    '5 reps per side. Step into deep lunge — back knee stays off the floor, front shin vertical. Drop elbow to floor inside front foot — hold 2 sec. Rotate and reach arm to ceiling, eyes following — hold 3 sec. Push back into straight-leg hamstring stretch, toes pulled up — hold 3 sec. Flow without stopping. Each side takes 12–15 sec.',
  advanced:
    '6–8 reps per side. Hold 5 kg dumbbell in the rotating hand for shoulder stability demand. From hamstring stretch, walk hands into full pike or down-dog before next rep. Add hip circle at lunge: draw a large circle with front knee before rotating. Elevate front foot on a low step for deeper hip flexor stretch.',
}

export const WorldsStretch = ({ data, update }) => {
  const [open, setOpen] = useState(false)

  const repsLabel = { beginner: '3 reps/side', intermediate: '5 reps/side', advanced: '6–8 reps/side' }

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
              <span className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">
                Daily · {repsLabel[data.level]}
              </span>
              {data.done && (
                <span className="text-[10px] font-bold tracking-wider text-[#00e676] uppercase">Done</span>
              )}
            </div>
            <h2 className="text-lg font-bold mt-0.5">World's Greatest Stretch</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Hip flexors · thoracic spine · hamstrings · shoulders</p>
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
