export const THEMES = [
  { value: 'dark', label: '☾ DARK' },
  { value: 'light', label: '☀ LIGHT' },
  { value: 'synthwave', label: '⏃ SYNTHWAVE' },
]

export default function ThemeToggle({ theme, onSelect }) {
  return (
    <select
      className="theme-select"
      value={theme}
      onChange={(e) => onSelect(e.target.value)}
      title="Select theme"
      aria-label="Select theme"
    >
      {THEMES.map((t) => (
        <option key={t.value} value={t.value}>
          {t.label}
        </option>
      ))}
    </select>
  )
}
