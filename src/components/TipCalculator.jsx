import { useState } from 'react'

const PRESETS = [15, 18, 20, 25]
const MIN_TIP = 15

export default function TipCalculator() {
  const [bill, setBill] = useState('')
  const [tip, setTip] = useState('')
  const [people, setPeople] = useState('1')

  const billNum = parseFloat(bill) || 0
  const tipNum = parseFloat(tip) || 0
  const peopleNum = Math.max(1, parseInt(people) || 1)

  const tipAmount = billNum * (tipNum / 100)
  const total = billNum + tipAmount
  const perPerson = total / peopleNum

  const fmt = (n) => '$' + n.toFixed(2)

  return (
    <div className="calculator tip-calc">
      <div className="tip-field">
        <label>BILL AMOUNT</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={bill}
          onChange={(e) => setBill(e.target.value)}
          placeholder="0.00"
        />
      </div>

      <div className="tip-field">
        <label>TIP %</label>
        <div className="tip-presets">
          {PRESETS.map((p) => (
            <button
              key={p}
              className={'btn' + (tip === String(p) ? ' selected' : '')}
              onClick={() => setTip(String(p))}
            >
              {p}%
            </button>
          ))}
        </div>
        <input
          type="number"
          min={MIN_TIP}
          max="100"
          step="0.1"
          value={tip}
          onChange={(e) => setTip(e.target.value)}
          placeholder={`Custom (min ${MIN_TIP}%)`}
          aria-label="Custom tip percentage"
        />
        {tip !== '' && tipNum < MIN_TIP && (
          <div className="tip-warning">Minimum tip is {MIN_TIP}%</div>
        )}
      </div>

      <div className="tip-field">
        <label>NUMBER OF PEOPLE</label>
        <input
          type="number"
          min="1"
          value={people}
          onChange={(e) => setPeople(e.target.value)}
          placeholder="1"
        />
      </div>

      <div className="tip-results">
        <div className="tip-result-row">
          <span>TIP AMOUNT</span>
          <span>{fmt(tipAmount)}</span>
        </div>
        <div className="tip-result-row">
          <span>TOTAL AMOUNT</span>
          <span>{fmt(total)}</span>
        </div>
        <div className="tip-result-row tip-result-highlight">
          <span>PER PERSON</span>
          <span>{fmt(perPerson)}</span>
        </div>
      </div>
    </div>
  )
}
