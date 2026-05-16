export default function ModeToggle({ mode, onToggle }) {
  return (
    <button className="icon-btn" onClick={onToggle} title="Toggle calculator mode">
      {mode === 'calculator' ? '% TIP' : '# CALC'}
    </button>
  )
}
