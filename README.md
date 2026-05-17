# CALC-X — Futuristic Calculator

> A cyberpunk-styled dual-mode calculator built with **React + Vite**. No backend. No nonsense. Pure frontend.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔢 Standard Calculator | Full arithmetic — add, subtract, multiply, divide, sign toggle, percentage |
| 💵 Tip Calculator | Split bills with preset tips (15%, 18%, 20%, 25%) plus a custom percentage input (15% minimum) |
| 🌗 Dark / Light Theme | Neon cyberpunk dark mode + clean electric-blue light mode |
| 🔤 Futuristic Fonts | Orbitron & Share Tech Mono for that sci-fi aesthetic |
| ⚡ Zero Backend | 100% client-side — no server, no API, no dependencies beyond React |

---

## 🛠 Tech Stack

- [React 18](https://react.dev/)
- [Vite 4](https://vitejs.dev/)
- [Google Fonts — Orbitron & Share Tech Mono](https://fonts.google.com/)

---

## 📋 Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) **v16 or higher**
- **npm** (comes with Node.js)

Verify with:
```bash
node -v
npm -v
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/calc-x.git
cd calc-x
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open your browser and navigate to **http://localhost:5173**

---

## 📦 Build for Production

```bash
npm run build
```

This outputs a production-ready bundle to the `dist/` folder.

To preview the production build locally:

```bash
npm run preview
```

---

## 📁 Project Structure

```
calc-x/
├── src/
│   ├── components/
│   │   ├── Calculator.jsx     # Standard calculator logic & UI
│   │   ├── TipCalculator.jsx  # Tip/bill splitting calculator
│   │   ├── ModeToggle.jsx     # Switch between calculator modes
│   │   └── ThemeToggle.jsx    # Dark/light theme switcher
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
└── package.json
```

---

## 📜 License

MIT — free to use, modify, and distribute.
