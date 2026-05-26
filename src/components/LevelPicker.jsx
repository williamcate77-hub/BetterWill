const LEVELS = ['beginner', 'intermediate', 'advanced']
const LABELS = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' }

export const LevelPicker = ({ value, onChange }) => (
  <div className="flex gap-1 p-1 bg-zinc-900 rounded-xl">
    {LEVELS.map(l => (
      <button
        key={l}
        onClick={() => onChange(l)}
        className={`flex-1 py-1.5 px-1 text-[11px] font-semibold rounded-lg transition-all tracking-wide ${
          value === l
            ? 'bg-zinc-700 text-white'
            : 'text-zinc-600 active:text-zinc-400'
        }`}
      >
        {LABELS[l]}
      </button>
    ))}
  </div>
)
