import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../App'
import ModeToggle from '../components/ModeToggle'
import ThemeToggle from '../components/ThemeToggle'

describe('App — rendering', () => {
  it('renders CALC-X title', () => {
    render(<App />)
    expect(screen.getByText('CALC-X')).toBeInTheDocument()
  })

  it('renders mode toggle button', () => {
    render(<App />)
    expect(screen.getByTitle('Toggle calculator mode')).toBeInTheDocument()
  })

  it('renders theme toggle button', () => {
    render(<App />)
    expect(screen.getByTitle('Toggle theme')).toBeInTheDocument()
  })

  it('renders Calculator by default', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'AC' })).toBeInTheDocument()
  })
})

describe('App — mode toggle', () => {
  it('switches to TipCalculator when mode toggled', () => {
    render(<App />)
    fireEvent.click(screen.getByTitle('Toggle calculator mode'))
    expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument()
  })

  it('switches back to Calculator when toggled again', () => {
    render(<App />)
    fireEvent.click(screen.getByTitle('Toggle calculator mode'))
    fireEvent.click(screen.getByTitle('Toggle calculator mode'))
    expect(screen.getByRole('button', { name: 'AC' })).toBeInTheDocument()
  })

  it('mode toggle label shows TIP when in calculator mode', () => {
    render(<App />)
    expect(screen.getByTitle('Toggle calculator mode')).toHaveTextContent('% TIP')
  })

  it('mode toggle label shows CALC when in tip mode', () => {
    render(<App />)
    fireEvent.click(screen.getByTitle('Toggle calculator mode'))
    expect(screen.getByTitle('Toggle calculator mode')).toHaveTextContent('# CALC')
  })
})

describe('App — theme toggle', () => {
  it('theme toggle shows LIGHT in dark mode', () => {
    render(<App />)
    expect(screen.getByTitle('Toggle theme')).toHaveTextContent('☀ LIGHT')
  })

  it('theme toggle shows DARK after toggling to light', () => {
    render(<App />)
    fireEvent.click(screen.getByTitle('Toggle theme'))
    expect(screen.getByTitle('Toggle theme')).toHaveTextContent('☾ DARK')
  })

  it('toggles html data-theme attribute', () => {
    render(<App />)
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    fireEvent.click(screen.getByTitle('Toggle theme'))
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('toggles back to dark theme', () => {
    render(<App />)
    fireEvent.click(screen.getByTitle('Toggle theme'))
    fireEvent.click(screen.getByTitle('Toggle theme'))
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })
})

describe('ModeToggle — unit', () => {
  it('shows "% TIP" in calculator mode', () => {
    render(<ModeToggle mode="calculator" onToggle={() => {}} />)
    expect(screen.getByRole('button')).toHaveTextContent('% TIP')
  })

  it('shows "# CALC" in tip mode', () => {
    render(<ModeToggle mode="tip" onToggle={() => {}} />)
    expect(screen.getByRole('button')).toHaveTextContent('# CALC')
  })

  it('calls onToggle when clicked', () => {
    let called = false
    render(<ModeToggle mode="calculator" onToggle={() => { called = true }} />)
    fireEvent.click(screen.getByRole('button'))
    expect(called).toBe(true)
  })
})

describe('ThemeToggle — unit', () => {
  it('shows "☀ LIGHT" in dark mode', () => {
    render(<ThemeToggle theme="dark" onToggle={() => {}} />)
    expect(screen.getByRole('button')).toHaveTextContent('☀ LIGHT')
  })

  it('shows "☾ DARK" in light mode', () => {
    render(<ThemeToggle theme="light" onToggle={() => {}} />)
    expect(screen.getByRole('button')).toHaveTextContent('☾ DARK')
  })

  it('calls onToggle when clicked', () => {
    let called = false
    render(<ThemeToggle theme="dark" onToggle={() => { called = true }} />)
    fireEvent.click(screen.getByRole('button'))
    expect(called).toBe(true)
  })
})
