import { weekDays, today } from './date'

/**
 * Returns urgency level based on how far behind on a weekly target.
 * done     → all complete
 * normal   → on track, plenty of time
 * warning  → a bit behind heading into later week
 * urgent   → need every remaining day to catch up
 * critical → mathematically impossible to hit target
 */
export const getUrgency = (days = [], weeklyTarget) => {
  const wd = weekDays()
  const todayStr = today()
  const todayIdx = wd.indexOf(todayStr) // 0=Mon … 6=Sun
  const daysLeft = 7 - todayIdx         // days remaining including today
  const completed = days.filter(d => wd.includes(d)).length
  const remaining = weeklyTarget - completed

  if (remaining <= 0) return 'done'
  if (remaining > daysLeft) return 'critical'  // can't possibly catch up
  if (remaining === daysLeft) return 'urgent'   // need to do it every single remaining day
  if (daysLeft <= 3 && remaining >= daysLeft - 1) return 'warning'
  return 'normal'
}

export const URGENCY = {
  done:     { ring: '#00e676', text: 'text-[#00e676]', border: 'border-[#00e676]/30', bg: 'bg-[#00e676]/10', label: 'text-[#00e676]' },
  normal:   { ring: '#ff6b2b', text: 'text-[#ff6b2b]', border: 'border-[#ff6b2b]/30', bg: 'bg-[#ff6b2b]/10', label: 'text-zinc-500' },
  warning:  { ring: '#f59e0b', text: 'text-amber-400', border: 'border-amber-400/30', bg: 'bg-amber-400/10', label: 'text-amber-400' },
  urgent:   { ring: '#f97316', text: 'text-orange-500', border: 'border-orange-500/30', bg: 'bg-orange-500/10', label: 'text-orange-500' },
  critical: { ring: '#ef4444', text: 'text-red-500', border: 'border-red-500/30', bg: 'bg-red-500/10', label: 'text-red-500' },
}

/** Colour for in-progress daily exercises (not yet completed today) */
export const dailyUrgency = (done, days, weeklyTarget) => {
  if (done) return 'done'
  return getUrgency(days, weeklyTarget)
}
