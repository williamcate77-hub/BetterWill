import { today } from '../utils/date'
import { ProgressRing } from './ProgressRing'
import { WeekDots } from './WeekDots'

const TARGET = 5 // 5 × 20 = 100 reps

export const DumbbellMoves = ({ data, update }) => {
  const isComplete = data.taps >= TARGET
  const progress = data.taps / TARGET
  const reps = data.taps * 20

  const tap = () => {
    if (isComplete) return
    const newTaps = data.taps + 1
    const nowComplete = newTaps >= TARGET
    const days = nowComplete && !data.days.includes(today())
      ? [...data.days, today()]
      : data.days
    update({ taps: newTaps, days })
  }

  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">Daily · 100 reps</span>
              {isComplete && (
                <span className="text-[10px] font-bold tracking-wider text-[#00e676] uppercase">Done</span>
              )}
            </div>
            <h2 className="text-lg font-bold mt-0.5">Dumbbell Moves</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              {reps}/100 reps · {data.taps}/{TARGET} sets of 20 · 5 kg pair
            </p>
          </div>
          <ProgressRing
            progress={progress}
            size={64}
            sw={5}
            color={isComplete ? '#00e676' : '#ff6b2b'}
          >
            <span className={`text-sm font-bold ${isComplete ? 'text-[#00e676]' : 'text-white'}`}>
              {reps}
            </span>
          </ProgressRing>
        </div>
      </div>

      <div className="px-5 pb-5">
        <div className="flex gap-1 mb-4">
          {Array.from({ length: TARGET }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i < data.taps ? 'bg-[#00e676]' : 'bg-zinc-800'
              }`}
            />
          ))}
        </div>

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
            {isComplete ? 'Complete' : '+20 Reps'}
          </button>
        </div>
      </div>
    </div>
  )
}
