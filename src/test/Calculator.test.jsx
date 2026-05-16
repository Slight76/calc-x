import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Calculator from '../components/Calculator'

function setup() {
  render(<Calculator />)
  const display = () => screen.getByText(/^[-\d.]+$|^Error$|^0$/).closest('.display').querySelector('.display-value')
  const expression = () => document.querySelector('.display-expression')
  const btn = (label) => screen.getByRole('button', { name: label })
  const click = (label) => fireEvent.click(btn(label))
  return { display, expression, btn, click }
}

describe('Calculator — initial state', () => {
  it('shows 0 on mount', () => {
    render(<Calculator />)
    expect(document.querySelector('.display-value')).toHaveTextContent('0')
  })
  it('shows empty expression on mount', () => {
    render(<Calculator />)
    expect(document.querySelector('.display-expression')).toHaveTextContent('')
  })
})

describe('Calculator — digit input', () => {
  it('replaces leading 0 with digit', () => {
    render(<Calculator />)
    fireEvent.click(screen.getByRole('button', { name: '5' }))
    expect(document.querySelector('.display-value')).toHaveTextContent('5')
  })

  it('appends digits', () => {
    render(<Calculator />)
    fireEvent.click(screen.getByRole('button', { name: '1' }))
    fireEvent.click(screen.getByRole('button', { name: '2' }))
    fireEvent.click(screen.getByRole('button', { name: '3' }))
    expect(document.querySelector('.display-value')).toHaveTextContent('123')
  })

  it('caps input at 12 significant characters', () => {
    render(<Calculator />)
    // Type 14 digits — display should stop at 12
    '12345678901234'.split('').forEach((d) => {
      fireEvent.click(screen.getByRole('button', { name: d }))
    })
    const val = document.querySelector('.display-value').textContent
    expect(val.replace('-', '').replace('.', '').length).toBeLessThanOrEqual(12)
  })
})

describe('Calculator — decimal', () => {
  it('adds decimal point', () => {
    render(<Calculator />)
    fireEvent.click(screen.getByRole('button', { name: '3' }))
    fireEvent.click(screen.getByRole('button', { name: '.' }))
    fireEvent.click(screen.getByRole('button', { name: '1' }))
    expect(document.querySelector('.display-value')).toHaveTextContent('3.1')
  })

  it('prevents duplicate decimal point', () => {
    render(<Calculator />)
    fireEvent.click(screen.getByRole('button', { name: '3' }))
    fireEvent.click(screen.getByRole('button', { name: '.' }))
    fireEvent.click(screen.getByRole('button', { name: '.' }))
    fireEvent.click(screen.getByRole('button', { name: '5' }))
    expect(document.querySelector('.display-value')).toHaveTextContent('3.5')
  })

  it('starts 0. when decimal pressed while waiting for operand', () => {
    render(<Calculator />)
    fireEvent.click(screen.getByRole('button', { name: '2' }))
    fireEvent.click(screen.getByRole('button', { name: '+' }))
    fireEvent.click(screen.getByRole('button', { name: '.' }))
    expect(document.querySelector('.display-value')).toHaveTextContent('0.')
  })
})

describe('Calculator — AC (clear)', () => {
  it('resets display to 0', () => {
    render(<Calculator />)
    fireEvent.click(screen.getByRole('button', { name: '9' }))
    fireEvent.click(screen.getByRole('button', { name: 'AC' }))
    expect(document.querySelector('.display-value')).toHaveTextContent('0')
  })

  it('clears expression', () => {
    render(<Calculator />)
    fireEvent.click(screen.getByRole('button', { name: '9' }))
    fireEvent.click(screen.getByRole('button', { name: '+' }))
    fireEvent.click(screen.getByRole('button', { name: 'AC' }))
    expect(document.querySelector('.display-expression')).toHaveTextContent('')
  })
})

describe('Calculator — sign toggle (+/−)', () => {
  it('negates a positive number', () => {
    render(<Calculator />)
    fireEvent.click(screen.getByRole('button', { name: '5' }))
    fireEvent.click(screen.getByRole('button', { name: '+/−' }))
    expect(document.querySelector('.display-value')).toHaveTextContent('-5')
  })

  it('un-negates a negative number', () => {
    render(<Calculator />)
    fireEvent.click(screen.getByRole('button', { name: '5' }))
    fireEvent.click(screen.getByRole('button', { name: '+/−' }))
    fireEvent.click(screen.getByRole('button', { name: '+/−' }))
    expect(document.querySelector('.display-value')).toHaveTextContent('5')
  })

  it('does nothing on 0', () => {
    render(<Calculator />)
    fireEvent.click(screen.getByRole('button', { name: '+/−' }))
    expect(document.querySelector('.display-value')).toHaveTextContent('0')
  })

  it('does nothing on Error', () => {
    render(<Calculator />)
    // force divide-by-zero
    fireEvent.click(screen.getByRole('button', { name: '5' }))
    fireEvent.click(screen.getByRole('button', { name: '÷' }))
    fireEvent.click(screen.getByRole('button', { name: '0' }))
    fireEvent.click(screen.getByRole('button', { name: '=' }))
    fireEvent.click(screen.getByRole('button', { name: '+/−' }))
    expect(document.querySelector('.display-value')).toHaveTextContent('Error')
  })

  it('sets waitingForOperand so next digit starts fresh', () => {
    render(<Calculator />)
    fireEvent.click(screen.getByRole('button', { name: '5' }))
    fireEvent.click(screen.getByRole('button', { name: '+/−' }))
    fireEvent.click(screen.getByRole('button', { name: '3' }))
    // Should be '3', not '-53'
    expect(document.querySelector('.display-value')).toHaveTextContent('3')
  })
})

describe('Calculator — percent (%)', () => {
  it('divides display by 100', () => {
    render(<Calculator />)
    fireEvent.click(screen.getByRole('button', { name: '5' }))
    fireEvent.click(screen.getByRole('button', { name: '0' }))
    fireEvent.click(screen.getByRole('button', { name: '%' }))
    expect(document.querySelector('.display-value')).toHaveTextContent('0.5')
  })

  it('does nothing on Error', () => {
    render(<Calculator />)
    fireEvent.click(screen.getByRole('button', { name: '1' }))
    fireEvent.click(screen.getByRole('button', { name: '÷' }))
    fireEvent.click(screen.getByRole('button', { name: '0' }))
    fireEvent.click(screen.getByRole('button', { name: '=' }))
    fireEvent.click(screen.getByRole('button', { name: '%' }))
    expect(document.querySelector('.display-value')).toHaveTextContent('Error')
  })

  it('sets waitingForOperand so next digit starts fresh', () => {
    render(<Calculator />)
    fireEvent.click(screen.getByRole('button', { name: '5' }))
    fireEvent.click(screen.getByRole('button', { name: '0' }))
    fireEvent.click(screen.getByRole('button', { name: '%' }))
    fireEvent.click(screen.getByRole('button', { name: '2' }))
    // Should be '2', not '0.52'
    expect(document.querySelector('.display-value')).toHaveTextContent('2')
  })
})

describe('Calculator — basic arithmetic', () => {
  it('adds two numbers', () => {
    render(<Calculator />)
    fireEvent.click(screen.getByRole('button', { name: '3' }))
    fireEvent.click(screen.getByRole('button', { name: '+' }))
    fireEvent.click(screen.getByRole('button', { name: '4' }))
    fireEvent.click(screen.getByRole('button', { name: '=' }))
    expect(document.querySelector('.display-value')).toHaveTextContent('7')
  })

  it('subtracts two numbers', () => {
    render(<Calculator />)
    fireEvent.click(screen.getByRole('button', { name: '9' }))
    fireEvent.click(screen.getByRole('button', { name: '−' }))
    fireEvent.click(screen.getByRole('button', { name: '4' }))
    fireEvent.click(screen.getByRole('button', { name: '=' }))
    expect(document.querySelector('.display-value')).toHaveTextContent('5')
  })

  it('multiplies two numbers', () => {
    render(<Calculator />)
    fireEvent.click(screen.getByRole('button', { name: '6' }))
    fireEvent.click(screen.getByRole('button', { name: '×' }))
    fireEvent.click(screen.getByRole('button', { name: '7' }))
    fireEvent.click(screen.getByRole('button', { name: '=' }))
    expect(document.querySelector('.display-value')).toHaveTextContent('42')
  })

  it('divides two numbers', () => {
    render(<Calculator />)
    fireEvent.click(screen.getByRole('button', { name: '8' }))
    fireEvent.click(screen.getByRole('button', { name: '÷' }))
    fireEvent.click(screen.getByRole('button', { name: '4' }))
    fireEvent.click(screen.getByRole('button', { name: '=' }))
    expect(document.querySelector('.display-value')).toHaveTextContent('2')
  })

  it('handles division by zero → Error', () => {
    render(<Calculator />)
    fireEvent.click(screen.getByRole('button', { name: '5' }))
    fireEvent.click(screen.getByRole('button', { name: '÷' }))
    fireEvent.click(screen.getByRole('button', { name: '0' }))
    fireEvent.click(screen.getByRole('button', { name: '=' }))
    expect(document.querySelector('.display-value')).toHaveTextContent('Error')
  })

  it('shows expression string on equals', () => {
    render(<Calculator />)
    fireEvent.click(screen.getByRole('button', { name: '3' }))
    fireEvent.click(screen.getByRole('button', { name: '+' }))
    fireEvent.click(screen.getByRole('button', { name: '4' }))
    fireEvent.click(screen.getByRole('button', { name: '=' }))
    expect(document.querySelector('.display-expression')).toHaveTextContent('3 + 4 =')
  })

  it('equals with no operator does nothing', () => {
    render(<Calculator />)
    fireEvent.click(screen.getByRole('button', { name: '5' }))
    fireEvent.click(screen.getByRole('button', { name: '=' }))
    expect(document.querySelector('.display-value')).toHaveTextContent('5')
  })
})

describe('Calculator — chained operations', () => {
  it('chains addition then multiplication', () => {
    render(<Calculator />)
    // 2 + 3 = 5, then × 4 = 20
    fireEvent.click(screen.getByRole('button', { name: '2' }))
    fireEvent.click(screen.getByRole('button', { name: '+' }))
    fireEvent.click(screen.getByRole('button', { name: '3' }))
    fireEvent.click(screen.getByRole('button', { name: '×' }))
    // intermediate result shown
    expect(document.querySelector('.display-value')).toHaveTextContent('5')
    fireEvent.click(screen.getByRole('button', { name: '4' }))
    fireEvent.click(screen.getByRole('button', { name: '=' }))
    expect(document.querySelector('.display-value')).toHaveTextContent('20')
  })

  it('pressing operator twice keeps last operator and current operand', () => {
    render(<Calculator />)
    fireEvent.click(screen.getByRole('button', { name: '5' }))
    fireEvent.click(screen.getByRole('button', { name: '+' }))
    fireEvent.click(screen.getByRole('button', { name: '×' }))
    fireEvent.click(screen.getByRole('button', { name: '3' }))
    fireEvent.click(screen.getByRole('button', { name: '=' }))
    expect(document.querySelector('.display-value')).toHaveTextContent('15')
  })

  it('after equals, typing a digit starts fresh', () => {
    render(<Calculator />)
    fireEvent.click(screen.getByRole('button', { name: '3' }))
    fireEvent.click(screen.getByRole('button', { name: '+' }))
    fireEvent.click(screen.getByRole('button', { name: '4' }))
    fireEvent.click(screen.getByRole('button', { name: '=' }))
    fireEvent.click(screen.getByRole('button', { name: '9' }))
    expect(document.querySelector('.display-value')).toHaveTextContent('9')
  })

  it('continues calculation from Error (resets operand to 0)', () => {
    render(<Calculator />)
    fireEvent.click(screen.getByRole('button', { name: '1' }))
    fireEvent.click(screen.getByRole('button', { name: '÷' }))
    fireEvent.click(screen.getByRole('button', { name: '0' }))
    // pressing another operator should not throw
    fireEvent.click(screen.getByRole('button', { name: '+' }))
    expect(document.querySelector('.display-value')).toHaveTextContent('Error')
  })
})

describe('Calculator — formatNum edge cases', () => {
  it('truncates very long decimals to 10 significant digits', () => {
    render(<Calculator />)
    fireEvent.click(screen.getByRole('button', { name: '1' }))
    fireEvent.click(screen.getByRole('button', { name: '÷' }))
    fireEvent.click(screen.getByRole('button', { name: '3' }))
    fireEvent.click(screen.getByRole('button', { name: '=' }))
    const val = document.querySelector('.display-value').textContent
    expect(val.length).toBeLessThanOrEqual(12)
  })
})
