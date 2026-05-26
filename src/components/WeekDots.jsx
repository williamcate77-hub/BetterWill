import { weekDays } from '../utils/date'

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export const WeekDots = ({ days = [], target, label = '' }) => {
  const wd = weekDays()
  const todayStr = new Date().toISOString().split('T')[0]
  const count = days.filter(d => wd.includes(d)).length

  return (
    <div className="flex items-end gap-3">
      <div className="flex gap-2">
        {wd.map((d, i) => {
          const done = days.includes(d)
          const isToday = d === todayStr
          return (
            <div key={d} className="flex flex-col items-center gap-1">
              <div
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  done
                    ? 'bg-[#00e676]'
                    : isToday
                    ? 'bg-zinc-600'
                    : 'bg-zinc-800'
                }`}
              />
              <span className={`text-[9px] font-medium ${isToday ? 'text-zinc-400' : 'text-zinc-700'}`}>
                {DAY_LABELS[i]}
              </span>
            </div>
          )
        })}
      </div>
      {target && (
        <span className="text-xs text-zinc-500 mb-0.5">
          {count}/{target}
          {label}
        </span>
      )}
    </div>
  )
}
