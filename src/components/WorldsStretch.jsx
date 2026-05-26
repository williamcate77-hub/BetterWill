import { useState } from 'react'
import { today } from '../utils/date'
import { click } from '../utils/audio'
import { getUrgency, URGENCY } from '../utils/urgency'
import { ProgressRing } from './ProgressRing'
import { WeekDots } from './WeekDots'
import { LevelPicker } from './LevelPicker'

const REPS = { beginner: '3 reps/side', intermediate: '5 reps/side', advanced: '6–8 reps/side' }

const HINTS = {
  beginner:
    '3 reps per side — go slowly with pauses. Start in tall plank. Step right foot outside right hand. Drop back knee to floor (kneeling lunge). Hands inside front foot — hold 5 sec. Lift right hand, rotate torso reaching to ceiling — hold 3 sec. Push hips back, straighten front leg into hamstring stretch — hold 5 sec. Repeat left.',
  intermediate:
    '5 reps per side — flowing sequence, back knee stays off floor. Deep lunge, front shin vertical. Drop elbow to floor inside front foot — hold 2 sec. Rotate and reach arm to ceiling, eyes following — hold 3 sec. Push back into straight-leg hamstring stretch, toes pulled up — hold 3 sec. No stopping between positions.',
  advanced:
    '6–8 reps per side. Hold 5 kg dumbbell in rotating hand for shoulder stability demand. From hamstring stretch, walk hands into full pike or down-dog before next rep. Add hip circle at lunge: draw large circle with front knee before rotating. Elevate front foot on a low step for deeper hip flexor depth.',
}

export const WorldsStretch = ({ data, update }) => {
  const [open, setOpen] = useState(false)
  const urgency = getUrgency(data.days, 7)
  const u = URGENCY[data.done ? 'done' : urgency]

  const mark = () => {
    if (data.done) return
    click()
    const days = data.days.includes(today()) ? data.days : [...data.days, today()]
    update({ done: true, days })
  }

  const setLevel = (level) => { click(); update({ level }) }

  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
      <button className="w-full text-left px-5 pt-5 pb-4" onClick={() => { click(); setOpen(o => !o) }}>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">
                Daily · {REPS[data.level]}
              </span>
              {data.done && <span className="text-[10px] font-bold tracking-wider text-[#00e676] uppercase">Done ✓</span>}
              {!data.done && urgency !== 'normal' && (
                <span className={`text-[10px] font-bold tracking-wider uppercase ${u.label}`}>
                  {urgency === 'critical' ? 'Critical' : urgency === 'urgent' ? 'Urgent' : 'Behind'}
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold mt-0.5">World's Greatest Stretch</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Hip flexors · thoracic spine · hamstrings · shoulders</p>
          </div>
          <ProgressRing progress={data.done ? 1 : 0} size={64} sw={5} color={u.ring}>
            <span className="text-lg" style={{ color: u.ring }}>{data.done ? '✓' : '—'}</span>
          </ProgressRing>
        </div>
      </button>

      <div className="px-5 pb-5 space-y-4">
        <LevelPicker value={data.level} onChange={setLevel} />
        {open && <p className="text-xs text-zinc-400 leading-relaxed">{HINTS[data.level]}</p>}
        <div className="flex items-center justify-between">
          <WeekDots days={data.days} target={7} label=" days" />
          <button
            onClick={mark}
            disabled={data.done}
            className="ml-4 px-5 py-3 rounded-xl text-sm font-bold transition-all active:scale-95"
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
  )
}
