import { useState, useEffect } from 'react'
import { addToHistory } from './History'

function calculate(a, op, b) {
  switch (op) {
    case '+': return a + b
    case '-': return a - b
    case '*': return a * b
    case '/': return b !== 0 ? a / b : 'Error'
    default: return b
  }
}

function formatNum(n) {
  if (n === 'Error') return 'Error'
  if (!isFinite(n) || isNaN(n)) return 'Error'
  const s = String(n)
  if (s.length <= 12) return s
  return parseFloat(n.toPrecision(10)).toString()
}

function opSymbol(op) {
  if (op === '*') return '×'
  if (op === '/') return '÷'
  if (op === '-') return '−'
  return op
}

export default function Calculator() {
  const [display, setDisplay] = useState('0')
  const [expression, setExpression] = useState('')
  const [operator, setOperator] = useState(null)
  const [operand, setOperand] = useState(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [lastOperator, setLastOperator] = useState(null)
  const [lastOperand, setLastOperand] = useState(null)

  const isPostResult = () =>
    waitingForOperand && operator === null && operand === null

  const handleDigit = (digit) => {
    if (waitingForOperand) {
      if (isPostResult()) setExpression('')
      setDisplay(digit)
      setWaitingForOperand(false)
      setLastOperator(null)
      setLastOperand(null)
    } else {
      if (display.replace('-', '').replace('.', '').length >= 12) return
      setDisplay(display === '0' ? digit : display + digit)
    }
  }

  const handleDecimal = () => {
    if (waitingForOperand) {
      if (isPostResult()) setExpression('')
      setDisplay('0.')
      setWaitingForOperand(false)
      setLastOperator(null)
      setLastOperand(null)
      return
    }
    if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }

  const handleOperator = (op) => {
    const current = parseFloat(display)
    if (operand !== null && !waitingForOperand) {
      const result = calculate(operand, operator, current)
      const rs = result === 'Error' ? 'Error' : formatNum(result)
      setDisplay(rs)
      setOperand(rs === 'Error' ? 0 : result)
      setExpression(rs + ' ' + opSymbol(op))
    } else {
      setOperand(current)
      setExpression(display + ' ' + opSymbol(op))
    }
    setOperator(op)
    setWaitingForOperand(true)
    setLastOperator(null)
    setLastOperand(null)
  }

  const handleEquals = () => {
    if (operator !== null && operand !== null) {
      const current = parseFloat(display)
      const result = calculate(operand, operator, current)
      const rs = result === 'Error' ? 'Error' : formatNum(result)
      const expression = formatNum(operand) + ' ' + opSymbol(operator) + ' ' + display + ' =';
      setExpression(expression)
      setDisplay(rs)
      addToHistory(expression, rs)
      setOperand(null)
      setOperator(null)
      setWaitingForOperand(true)
      if (rs !== 'Error') {
        setLastOperator(operator)
        setLastOperand(current)
      } else {
        setLastOperator(null)
        setLastOperand(null)
      }
      return
    }
    if (lastOperator !== null && lastOperand !== null && display !== 'Error') {
      const current = parseFloat(display)
      const result = calculate(current, lastOperator, lastOperand)
      const rs = result === 'Error' ? 'Error' : formatNum(result)
      const expression = display + ' ' + opSymbol(lastOperator) + ' ' + formatNum(lastOperand) + ' =';
      setExpression(expression)
      setDisplay(rs)
      addToHistory(expression, rs)
      setWaitingForOperand(true)
      if (rs === 'Error') {
        setLastOperator(null)
        setLastOperand(null)
      }
    }
  }

  const handleClear = () => {
    setDisplay('0')
    setExpression('')
    setOperator(null)
    setOperand(null)
    setWaitingForOperand(false)
    setLastOperator(null)
    setLastOperand(null)
  }

  const handleSign = () => {
    if (display === '0' || display === 'Error') return
    setDisplay(display.startsWith('-') ? display.slice(1) : '-' + display)
    setWaitingForOperand(true)
  }

  const handlePercent = () => {
    if (display === 'Error') return
    setDisplay(formatNum(parseFloat(display) / 100))
    setWaitingForOperand(true)
  }

  const handleBackspace = () => {
    if (waitingForOperand || display === 'Error') return
    if (display.length <= 1 || (display.length === 2 && display.startsWith('-'))) {
      setDisplay('0')
    } else {
      setDisplay(display.slice(0, -1))
    }
  }

  useEffect(() => {
    const onKeyDown = (e) => {
      const { key } = e
      const active = document.activeElement
      const isButton = active && active.tagName === 'BUTTON'
      // Enter would otherwise also re-click the focused on-screen button.
      if ((key === 'Enter' || key === ' ') && isButton) {
        active.blur()
      }
      if (key >= '0' && key <= '9') {
        e.preventDefault()
        handleDigit(key)
      } else if (key === '.') {
        e.preventDefault()
        handleDecimal()
      } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        e.preventDefault()
        handleOperator(key)
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault()
        handleEquals()
      } else if (key === 'Escape') {
        e.preventDefault()
        handleClear()
      } else if (key === 'Backspace') {
        e.preventDefault()
        handleBackspace()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  const buttons = [
    { label: 'AC',  action: handleClear,               cls: 'btn clear' },
    { label: '+/−', action: handleSign,                cls: 'btn operator' },
    { label: '%',   action: handlePercent,             cls: 'btn operator' },
    { label: '÷',   action: () => handleOperator('/'), cls: 'btn operator' },
    { label: '7',   action: () => handleDigit('7'),    cls: 'btn' },
    { label: '8',   action: () => handleDigit('8'),    cls: 'btn' },
    { label: '9',   action: () => handleDigit('9'),    cls: 'btn' },
    { label: '×',   action: () => handleOperator('*'), cls: 'btn operator' },
    { label: '4',   action: () => handleDigit('4'),    cls: 'btn' },
    { label: '5',   action: () => handleDigit('5'),    cls: 'btn' },
    { label: '6',   action: () => handleDigit('6'),    cls: 'btn' },
    { label: '−',   action: () => handleOperator('-'), cls: 'btn operator' },
    { label: '1',   action: () => handleDigit('1'),    cls: 'btn' },
    { label: '2',   action: () => handleDigit('2'),    cls: 'btn' },
    { label: '3',   action: () => handleDigit('3'),    cls: 'btn' },
    { label: '+',   action: () => handleOperator('+'), cls: 'btn operator' },
    { label: '0',   action: () => handleDigit('0'),    cls: 'btn span2' },
    { label: '.',   action: handleDecimal,             cls: 'btn' },
    { label: '=',   action: handleEquals,              cls: 'btn equals' },
  ]

  return (
    <div className="calculator">
      <div className="display">
        <div className="display-expression">{expression}</div>
        <div className="display-value">{display}</div>
      </div>
      <div className="btn-grid">
        {buttons.map((btn, i) => (
          <button key={i} className={btn.cls} onClick={btn.action}>
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  )
}
