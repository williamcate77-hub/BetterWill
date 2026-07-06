import { useCallback } from 'react'
import { useState } from 'react'
import { today } from '../utils/date'
import { click } from '../utils/audio'
import { getUrgency, URGENCY } from '../utils/urgency'
import { ProgressRing } from './ProgressRing'
import { WeekDots } from './WeekDots'
import { CountdownTimer } from './CountdownTimer'
import { ResetButton } from './ResetButton'

const DURATION = 180 // 3 minutes, fixed

export const BackRoll = ({ data, update }) => {
  const [open, setOpen] = useState(false)
  const urgency = getUrgency(data.days, 7)
  const u = URGENCY[data.done ? 'done' : urgency]

  const onTimerComplete = useCallback(() => {
    if (data.done) return
    const days = data.days.includes(today()) ? data.days : [...data.days, today()]
    update({ done: true, days })
  }, [data.done, data.days, update])

  const mark = () => {
    if (data.done) return
    click()
    const days = data.days.includes(today()) ? data.days : [...data.days, today()]
    update({ done: true, days })
  }

  const canReset = data.done || data.days.includes(today())
  const reset = () => update({ done: false, days: data.days.filter(d => d !== today()) })

  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
      <button className="w-full text-left px-5 pt-5 pb-4" onClick={() => { click(); setOpen(o => !o) }}>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">
                Daily · 3 min
              </span>
              {data.done && <span className="text-[10px] font-bold tracking-wider text-[#00e676] uppercase">Done ✓</span>}
              {!data.done && urgency !== 'normal' && (
                <span className={`text-[10px] font-bold tracking-wider uppercase ${u.label}`}>
                  {urgency === 'critical' ? 'Critical' : urgency === 'urgent' ? 'Urgent' : 'Behind'}
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold mt-0.5">Back Roll</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Thoracic decompression · spinal mobility · chest opener</p>
          </div>
          <ProgressRing progress={data.done ? 1 : 0} size={64} sw={5} color={u.ring}>
            <span className="text-lg" style={{ color: u.ring }}>{data.done ? '✓' : '—'}</span>
          </ProgressRing>
        </div>
      </button>

      <div className="px-5 pb-5 space-y-4">
        {open && (
          <p className="text-xs text-zinc-400 leading-relaxed">
            Lie on a foam roller placed along your spine. Arms wide, let gravity open your chest and decompress the thoracic spine. Gently roll from upper shoulders to mid-back — not neck or lumbar. Pause at tight spots for 3 slow breaths. Finish with arms overhead for a full chest opener.
          </p>
        )}

        {!data.done && (
          <CountdownTimer
            duration={DURATION}
            onComplete={onTimerComplete}
            color={u.ring}
          />
        )}

        <div className="flex items-center justify-between">
          <WeekDots days={data.days} target={7} label=" days" />
          <div className="ml-4 flex items-center gap-2">
            {canReset && <ResetButton onReset={reset} />}
            <button
              onClick={mark}
              disabled={data.done}
              className="px-5 py-3 rounded-xl text-sm font-bold transition-all active:scale-95"
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
    </div>
  )
}
