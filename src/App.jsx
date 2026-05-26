import { useEffect } from 'react'
import { useStore } from './hooks/useStore'
import { fmtDate } from './utils/date'
import { unlockAudio } from './utils/audio'
import { BarHangs } from './components/BarHangs'
import { AsianSquat } from './components/AsianSquat'
import { WorldsStretch } from './components/WorldsStretch'
import { Kettlebell } from './components/Kettlebell'
import { DumbbellMoves } from './components/DumbbellMoves'
import { MealWalk } from './components/MealWalk'
import { IntervalWalk } from './components/IntervalWalk'

export default function App() {
  const { state, update } = useStore()

  useEffect(() => {
    document.addEventListener('touchstart', unlockAudio, { once: true })
    document.addEventListener('click', unlockAudio, { once: true })
  }, [])

  return (
    <div className="min-h-dvh bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-lg border-b border-zinc-900">
        <div className="px-5 pt-safe-top pb-4" style={{ paddingTop: 'max(1.25rem, env(safe-area-inset-top))' }}>
          <div className="flex items-baseline justify-between">
            <h1 className="text-2xl font-bold tracking-tight">BetterWill</h1>
            <span className="text-[11px] text-zinc-500 font-medium tracking-wide uppercase">
              {fmtDate()}
            </span>
          </div>
          <p className="text-[11px] text-zinc-600 mt-0.5 tracking-widest uppercase">
            Movement Protocol
          </p>
        </div>
      </div>

      {/* Exercise cards */}
      <div className="px-4 pb-10 pt-4 space-y-3" style={{ paddingBottom: 'max(2.5rem, env(safe-area-inset-bottom))' }}>
        <BarHangs data={state.barHangs} update={p => update('barHangs', p)} />
        <AsianSquat data={state.asianSquat} update={p => update('asianSquat', p)} />
        <WorldsStretch data={state.worldsStretch} update={p => update('worldsStretch', p)} />
        <Kettlebell data={state.kettlebell} update={p => update('kettlebell', p)} />
        <DumbbellMoves data={state.dumbbell} update={p => update('dumbbell', p)} />
        <MealWalk data={state.mealWalk} update={p => update('mealWalk', p)} />
        <IntervalWalk data={state.intervalWalk} update={p => update('intervalWalk', p)} />
      </div>
    </div>
  )
}
