import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import TipCalculator from '../components/TipCalculator'

function getResults() {
  const rows = document.querySelectorAll('.tip-result-row')
  return {
    tip: rows[0]?.querySelector('span:last-child')?.textContent,
    total: rows[1]?.querySelector('span:last-child')?.textContent,
    perPerson: rows[2]?.querySelector('span:last-child')?.textContent,
  }
}

describe('TipCalculator — initial state', () => {
  it('renders bill, tip, and people inputs', () => {
    render(<TipCalculator />)
    expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('0')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('1')).toBeInTheDocument()
  })

  it('shows $0.00 for all results when empty', () => {
    render(<TipCalculator />)
    const { tip, total, perPerson } = getResults()
    expect(tip).toBe('$0.00')
    expect(total).toBe('$0.00')
    expect(perPerson).toBe('$0.00')
  })
})

describe('TipCalculator — basic calculation', () => {
  it('calculates tip and total for $100 at 20%', () => {
    render(<TipCalculator />)
    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '100' } })
    fireEvent.change(screen.getByPlaceholderText('0'), { target: { value: '20' } })
    const { tip, total, perPerson } = getResults()
    expect(tip).toBe('$20.00')
    expect(total).toBe('$120.00')
    expect(perPerson).toBe('$120.00')
  })

  it('splits per person correctly', () => {
    render(<TipCalculator />)
    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '100' } })
    fireEvent.change(screen.getByPlaceholderText('0'), { target: { value: '20' } })
    fireEvent.change(screen.getByPlaceholderText('1'), { target: { value: '4' } })
    const { perPerson } = getResults()
    expect(perPerson).toBe('$30.00')
  })

  it('handles zero bill', () => {
    render(<TipCalculator />)
    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '0' } })
    fireEvent.change(screen.getByPlaceholderText('0'), { target: { value: '15' } })
    const { tip, total } = getResults()
    expect(tip).toBe('$0.00')
    expect(total).toBe('$0.00')
  })

  it('handles zero tip', () => {
    render(<TipCalculator />)
    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '50' } })
    fireEvent.change(screen.getByPlaceholderText('0'), { target: { value: '0' } })
    const { tip, total, perPerson } = getResults()
    expect(tip).toBe('$0.00')
    expect(total).toBe('$50.00')
    expect(perPerson).toBe('$50.00')
  })

  it('handles decimal bill amounts', () => {
    render(<TipCalculator />)
    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '45.50' } })
    fireEvent.change(screen.getByPlaceholderText('0'), { target: { value: '10' } })
    const { tip, total } = getResults()
    expect(tip).toBe('$4.55')
    expect(total).toBe('$50.05')
  })
})

describe('TipCalculator — preset tip buttons', () => {
  it('renders all preset buttons', () => {
    render(<TipCalculator />)
    ;[10, 15, 18, 20, 25].forEach((p) => {
      expect(screen.getByRole('button', { name: `${p}%` })).toBeInTheDocument()
    })
  })

  it('selecting a preset fills the tip input', () => {
    render(<TipCalculator />)
    fireEvent.click(screen.getByRole('button', { name: '15%' }))
    const tipInput = screen.getByPlaceholderText('0')
    expect(tipInput.value).toBe('15')
  })

  it('applies selected preset to calculation', () => {
    render(<TipCalculator />)
    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '200' } })
    fireEvent.click(screen.getByRole('button', { name: '10%' }))
    const { tip, total } = getResults()
    expect(tip).toBe('$20.00')
    expect(total).toBe('$220.00')
  })

  it('selected preset button gets selected class', () => {
    render(<TipCalculator />)
    const btn25 = screen.getByRole('button', { name: '25%' })
    fireEvent.click(btn25)
    expect(btn25.className).toContain('selected')
  })

  it('non-selected preset buttons do not have selected class', () => {
    render(<TipCalculator />)
    fireEvent.click(screen.getByRole('button', { name: '20%' }))
    const btn15 = screen.getByRole('button', { name: '15%' })
    expect(btn15.className).not.toContain('selected')
  })
})

describe('TipCalculator — negative input clamping', () => {
  it('treats negative bill as $0', () => {
    render(<TipCalculator />)
    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '-50' } })
    fireEvent.change(screen.getByPlaceholderText('0'), { target: { value: '20' } })
    const { tip, total } = getResults()
    expect(tip).toBe('$0.00')
    expect(total).toBe('$0.00')
  })

  it('treats negative tip as 0%', () => {
    render(<TipCalculator />)
    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '100' } })
    fireEvent.change(screen.getByPlaceholderText('0'), { target: { value: '-10' } })
    const { tip, total } = getResults()
    expect(tip).toBe('$0.00')
    expect(total).toBe('$100.00')
  })

  it('treats 0 people as 1 person (Math.max guard)', () => {
    render(<TipCalculator />)
    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '100' } })
    fireEvent.change(screen.getByPlaceholderText('0'), { target: { value: '20' } })
    fireEvent.change(screen.getByPlaceholderText('1'), { target: { value: '0' } })
    const { perPerson } = getResults()
    expect(perPerson).toBe('$120.00')
  })
})

describe('TipCalculator — all presets calculate correctly', () => {
  ;[10, 15, 18, 20, 25].forEach((pct) => {
    it(`${pct}% preset on $100 bill`, () => {
      render(<TipCalculator />)
      fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '100' } })
      fireEvent.click(screen.getByRole('button', { name: `${pct}%` }))
      const { tip } = getResults()
      expect(tip).toBe(`$${pct}.00`)
    })
  })
})
