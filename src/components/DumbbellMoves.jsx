import { today } from '../utils/date'
import { click } from '../utils/audio'
import { getUrgency, URGENCY } from '../utils/urgency'
import { ProgressRing } from './ProgressRing'
import { WeekDots } from './WeekDots'
import { LevelPicker } from './LevelPicker'

const CFG = {
  beginner: {
    target: 5, perTap: 10, totalLabel: '50 reps/day', tapLabel: '+10 Reps',
    hint: 'Choose 2–3 movements: curl, lateral raise, or deadlift. Focus on control — 3-sec lowering phase. Rest as needed.',
  },
  intermediate: {
    target: 5, perTap: 15, totalLabel: '75 reps/day', tapLabel: '+15 Reps',
    hint: 'Superset two movements back-to-back with minimal rest. Try: renegade row + thruster, or Romanian deadlift + bent-over row.',
  },
  advanced: {
    target: 5, perTap: 20, totalLabel: '100 reps/day', tapLabel: '+20 Reps',
    hint: '4 movements × 25 reps with minimal rest. Try: dumbbell snatch, devil press, Bulgarian split squat, push press.',
  },
}

export const DumbbellMoves = ({ data, update }) => {
  const cfg = CFG[data.level]
  const isComplete = data.taps >= cfg.target
  const reps = data.taps * cfg.perTap
  const totalReps = cfg.target * cfg.perTap
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

  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">
                Daily · {cfg.totalLabel}
              </span>
              {isComplete && <span className="text-[10px] font-bold tracking-wider text-[#00e676] uppercase">Done ✓</span>}
              {!isComplete && urgency !== 'normal' && (
                <span className={`text-[10px] font-bold tracking-wider uppercase ${u.label}`}>
                  {urgency === 'critical' ? 'Critical' : urgency === 'urgent' ? 'Urgent' : 'Behind'}
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold mt-0.5">Dumbbell Moves</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              {reps}/{totalReps} reps · 5 kg pair
            </p>
          </div>
          <ProgressRing progress={data.taps / cfg.target} size={64} sw={5} color={u.ring}>
            <span className="text-sm font-bold" style={{ color: u.ring }}>{reps}</span>
          </ProgressRing>
        </div>
      </div>

      <div className="px-5 pb-5 space-y-4">
        <LevelPicker value={data.level} onChange={setLevel} />

        <p className="text-xs text-zinc-600 leading-relaxed">{cfg.hint}</p>

        <div className="flex gap-1">
          {Array.from({ length: cfg.target }).map((_, i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full transition-colors"
              style={{ background: i < data.taps ? u.ring : '#27272a' }}
            />
          ))}
        </div>

        <div className="flex items-center justify-between">
          <WeekDots days={data.days} target={7} label=" days" />
          <button
            onClick={tap}
            disabled={isComplete}
            className="ml-4 px-5 py-3 rounded-xl text-sm font-bold transition-all active:scale-95"
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
  )
}
