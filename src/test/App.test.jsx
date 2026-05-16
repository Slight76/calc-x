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

  it('renders theme selector', () => {
    render(<App />)
    expect(screen.getByTitle('Select theme')).toBeInTheDocument()
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

describe('App — theme selector', () => {
  it('theme selector defaults to dark', () => {
    render(<App />)
    expect(screen.getByTitle('Select theme')).toHaveValue('dark')
  })

  it('changes html data-theme attribute to light', () => {
    render(<App />)
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    fireEvent.change(screen.getByTitle('Select theme'), { target: { value: 'light' } })
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('changes html data-theme attribute to synthwave', () => {
    render(<App />)
    fireEvent.change(screen.getByTitle('Select theme'), { target: { value: 'synthwave' } })
    expect(document.documentElement.getAttribute('data-theme')).toBe('synthwave')
  })

  it('can switch back to dark theme', () => {
    render(<App />)
    fireEvent.change(screen.getByTitle('Select theme'), { target: { value: 'light' } })
    fireEvent.change(screen.getByTitle('Select theme'), { target: { value: 'dark' } })
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('exposes all three theme options', () => {
    render(<App />)
    const select = screen.getByTitle('Select theme')
    const values = Array.from(select.querySelectorAll('option')).map((o) => o.value)
    expect(values).toEqual(['dark', 'light', 'synthwave'])
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
  it('renders current theme as selected value', () => {
    render(<ThemeToggle theme="dark" onSelect={() => {}} />)
    expect(screen.getByRole('combobox')).toHaveValue('dark')
  })

  it('renders all three theme options', () => {
    render(<ThemeToggle theme="dark" onSelect={() => {}} />)
    const select = screen.getByRole('combobox')
    expect(select.querySelectorAll('option')).toHaveLength(3)
  })

  it('calls onSelect with new value when changed', () => {
    let selected = null
    render(<ThemeToggle theme="dark" onSelect={(v) => { selected = v }} />)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'synthwave' } })
    expect(selected).toBe('synthwave')
  })
})
