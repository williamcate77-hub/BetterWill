import { today } from '../utils/date'
import { weekDays } from '../utils/date'
import { WeekDots } from './WeekDots'

const WEEKLY_TARGET = 7

export const MealWalk = ({ data, update }) => {
  const wd = weekDays()
  const weeklyCount = data.days.filter(d => wd.includes(d)).length
  const isWeeklyDone = weeklyCount >= WEEKLY_TARGET
  const todayCount = data.days.filter(d => d === today()).length

  const tap = () => {
    update({ days: [...data.days, today()] })
  }

  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">
                Weekly · 7 walks
              </span>
              {isWeeklyDone && (
                <span className="text-[10px] font-bold tracking-wider text-[#00e676] uppercase">Done</span>
              )}
            </div>
            <h2 className="text-lg font-bold mt-0.5">10-Min Meal Walk</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              After a meal · {weeklyCount}/{WEEKLY_TARGET} this week
              {todayCount > 0 ? ` · ${todayCount} today` : ''}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center w-16 h-16">
            <span className={`text-3xl font-bold ${isWeeklyDone ? 'text-[#00e676]' : 'text-white'}`}>
              {weeklyCount}
            </span>
            <span className="text-[10px] text-zinc-600">/{WEEKLY_TARGET}</span>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5">
        <div className="flex items-center justify-between">
          <WeekDots days={data.days} target={WEEKLY_TARGET} label=" walks" />
          <button
            onClick={tap}
            className="ml-4 px-5 py-3 rounded-xl text-sm font-bold transition-all active:scale-95 bg-[#00e676]/10 border border-[#00e676]/30 text-[#00e676] active:bg-[#00e676]/20"
          >
            Log Walk
          </button>
        </div>
      </div>
    </div>
  )
}
