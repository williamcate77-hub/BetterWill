import { today, weekDays } from '../utils/date'
import { click } from '../utils/audio'
import { getUrgency, URGENCY } from '../utils/urgency'
import { WeekDots } from './WeekDots'
import { LevelPicker } from './LevelPicker'

const WEEKLY_TARGET = { beginner: 4, intermediate: 5, advanced: 5 }
const LABEL         = { beginner: '4×/week', intermediate: '5×/week', advanced: '5×/week' }
const HINT = {
  beginner:     '4 walks this week. 10 min after any meal. Focus on heel-to-toe strike and upright posture. No phone while walking.',
  intermediate: '5 walks this week. After larger meals. Add a little arm swing and pick up the pace slightly. Stay relaxed.',
  advanced:     '5 walks this week. Brisk pace, deliberate. Use this as active recovery and blood-glucose management after every main meal you can.',
}

export const MealWalk = ({ data, update }) => {
  const wd = weekDays()
  const target = WEEKLY_TARGET[data.level]
  const weeklyCount = data.days.filter(d => wd.includes(d)).length
  const urgency = getUrgency(data.days, target)
  const u = URGENCY[urgency]
  const todayCount = data.days.filter(d => d === today()).length
  const isWeeklyDone = weeklyCount >= target

  const tap = () => {
    click()
    update({ days: [...data.days, today()] })
  }

  const setLevel = (level) => { click(); update({ level }) }

  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">
                Weekly · {LABEL[data.level]}
              </span>
              {isWeeklyDone && <span className="text-[10px] font-bold tracking-wider text-[#00e676] uppercase">Done ✓</span>}
              {!isWeeklyDone && urgency !== 'normal' && (
                <span className={`text-[10px] font-bold tracking-wider uppercase ${u.label}`}>
                  {urgency === 'critical' ? 'Critical' : urgency === 'urgent' ? 'Urgent' : 'Behind'}
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold mt-0.5">10-Min Meal Walk</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              {weeklyCount}/{target} this week{todayCount > 0 ? ` · ${todayCount} today` : ''}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center w-16 h-16">
            <span className="text-3xl font-bold" style={{ color: isWeeklyDone ? '#00e676' : u.ring }}>
              {weeklyCount}
            </span>
            <span className="text-[10px] text-zinc-600">/{target}</span>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 space-y-4">
        <LevelPicker value={data.level} onChange={setLevel} />
        <p className="text-xs text-zinc-600 leading-relaxed">{HINT[data.level]}</p>
        <div className="flex items-center justify-between">
          <WeekDots days={data.days} target={target} label=" walks" />
          <button
            onClick={tap}
            className="ml-4 px-5 py-3 rounded-xl text-sm font-bold transition-all active:scale-95"
            style={{ background: `${u.ring}18`, border: `1px solid ${u.ring}50`, color: u.ring }}
          >
            Log Walk
          </button>
        </div>
      </div>
    </div>
  )
}
