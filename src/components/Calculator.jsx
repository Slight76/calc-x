import { useState } from 'react'

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

  const handleDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(digit)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? digit : display + digit)
    }
  }

  const handleDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
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
  }

  const handleEquals = () => {
    if (operator === null || operand === null) return
    const current = parseFloat(display)
    const result = calculate(operand, operator, current)
    const rs = result === 'Error' ? 'Error' : formatNum(result)
    setExpression(formatNum(operand) + ' ' + opSymbol(operator) + ' ' + display + ' =')
    setDisplay(rs)
    setOperand(null)
    setOperator(null)
    setWaitingForOperand(true)
  }

  const handleClear = () => {
    setDisplay('0')
    setExpression('')
    setOperator(null)
    setOperand(null)
    setWaitingForOperand(false)
  }

  const handleSign = () => {
    if (display === '0' || display === 'Error') return
    setDisplay(display.startsWith('-') ? display.slice(1) : '-' + display)
  }

  const handlePercent = () => {
    if (display === 'Error') return
    setDisplay(formatNum(parseFloat(display) / 100))
  }

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
