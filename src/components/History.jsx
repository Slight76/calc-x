import { useEffect, useState } from "react";

const HISTORY_KEY = "calculator-history";

export function loadHistory() {
  const raw = localStorage.getItem(HISTORY_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveHistory(history) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function addToHistory(expression, result) {
  const history = loadHistory();

  history.unshift({
    expression,
    result,
    time: Date.now(),
  });

  // keep last 100
  const trimmed = history.slice(0, 100);

  saveHistory(trimmed);
}

function Panel({ toggleOpen }) {
  const [history, setHistory] = useState();

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  return (
    <>
      <div className="overlay" onClick={toggleOpen} />

      <aside className="panel">
        <h2 style={{ paddingBottom: 8 }}>History</h2>

        <div style={{ gap: 12 }}>
          {history &&
            history
              .sort((h) => h.time)
              .map((h) => (
                <div key={h.time}>
                  <div>{h.expression}</div>
                  <strong style={{ fontSize: 20 }}>{h.result}</strong>
                </div>
              ))}
        </div>
      </aside>
    </>
  );
}

export default function History() {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => setOpen((p) => !p);

  return (
    <>
      <button
        className="icon-btn"
        title="Toggle calculator mode"
        onClick={toggleOpen}
      >
        History
      </button>
      {open && <Panel toggleOpen={toggleOpen} />}
    </>
  );
}
