export default function ThemeToggle({ theme, onToggle }) {
  return (
    <button className="icon-btn" onClick={onToggle} title="Toggle theme">
      {theme === 'dark' ? '☀ LIGHT' : '☾ DARK'}
    </button>
  )
}
