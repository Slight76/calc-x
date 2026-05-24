import { useState, useEffect } from 'react'
import Calculator from './components/Calculator'
import TipCalculator from './components/TipCalculator'
import ThemeToggle from './components/ThemeToggle'
import ModeToggle from './components/ModeToggle'
import History from './components/History'

export default function App() {
  const [theme, setTheme] = useState('dark')
  const [mode, setMode] = useState('calculator')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleMode = () => setMode((m) => (m === 'calculator' ? 'tip' : 'calculator'))

  return (
    <div className="app-wrapper" data-theme={theme}>
      <header className="app-header">
        <span className="app-title">CALC-X</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <ModeToggle mode={mode} onToggle={toggleMode} />
          <ThemeToggle theme={theme} onSelect={setTheme} />
        </div>
      </header>
      {mode === 'calculator' ? <Calculator /> : <TipCalculator />}

      <footer className='app-footer'>
        <History />
      </footer>
    </div>
  )
}
