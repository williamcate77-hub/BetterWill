import { click } from '../utils/audio'

// Secondary button to undo today's progress after an accidental tap
export const ResetButton = ({ onReset }) => (
  <button
    onClick={() => { click(); onReset() }}
    className="px-3.5 py-3 rounded-xl text-sm font-bold bg-zinc-900 border border-zinc-800 text-zinc-500 transition-all active:scale-95"
  >
    Reset
  </button>
)
