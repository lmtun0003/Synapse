# SYNAPSE

> **Every Move Changes Everything.**

A premium logic puzzle game built with React, TypeScript, TailwindCSS, and Framer Motion. Designed to feel like a Top 10 App Store game.

---

## Features

### Game Modes
- **Campaign** — 100+ handcrafted levels across 5 worlds, each introducing a new mechanic
- **Daily Puzzle** — The same puzzle for everyone, every day. Leaderboard resets at midnight
- **Endless** — Procedurally generated puzzles with intelligent difficulty scaling
- **Ranked** — Elo-based competitive mode with 8 rank tiers (Bronze → Synapse)
- **Puzzle Creator** — Design, test, and share custom puzzles with share codes

### Mechanics
Each world introduces a new mechanic:
1. **Basic Activation** (Levels 1–20)
2. **Rotation** (Levels 21–40)
3. **Mirrors** (Levels 41–60)
4. **Gravity** (Levels 61–80)
5. **Teleporters** (Levels 81–100)

### Rating System
Every level is rated on efficiency:
- ⚡ **Perfect** — Flawless optimisation
- 🥇 **Gold** — Excellent
- 🥈 **Silver** — Good
- 🥉 **Bronze** — Completed

### Progression
- XP & Level system (exponential scaling)
- Elo rating for ranked play
- Daily streaks with rewards
- Badges & achievements
- Sparks (free currency) and Prisms (premium currency)
- Battle Pass with 100 reward levels per 60-day season

### Monetisation (Cosmetics Only)
- Themes, board skins, icons, animations, victory effects
- No gameplay advantages. Ever.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Styling | TailwindCSS v4 |
| Animation | Framer Motion |
| State | Zustand (with localStorage persistence) |
| Backend | Supabase (Auth, DB, Realtime) |
| Build | Vite 8 |
| Testing | Vitest + Playwright |

---

## Getting Started

```bash
cd synapse
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Environment Variables

Create `.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Without these, the app runs in offline/local mode using localStorage.

---

## Project Structure

```
src/
├── components/
│   ├── ui/          # Button, GlassCard, Badge, ProgressBar
│   └── game/        # GameBoard, GameNode, ConnectionLines, GameHUD, LevelCompleteModal
├── pages/           # HomePage, CampaignPage, GamePage, DailyPage, etc.
├── engine/          # gameEngine.ts — signal propagation, win detection, puzzle generation
├── store/           # gameStore.ts — Zustand store with persistence
├── data/            # levels.ts — 100 handcrafted campaign levels across 5 worlds
├── hooks/           # useKeyboardShortcuts, useHaptics
├── lib/             # supabase.ts — backend integration
├── types/           # game.ts — all TypeScript interfaces
└── styles/          # globals.css — design tokens, animations
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` | Undo last move |
| `Ctrl+R` | Reset puzzle |

---

## Design Philosophy

- **Apple HIG** × **Nothing OS** × **Arc Browser** — clean, intentional, premium
- Dark-first (#0B0B0D background), electric blue accent (#3B82F6)
- 120fps-targeted animations via Framer Motion
- Glass morphism panels with soft blur and depth
- No visual clutter — every element earns its place

---

## Roadmap

Future features ready to add:
- Guilds & clan wars
- Seasonal tournaments
- AI-generated daily puzzles
- Twitch integration & spectator mode
- Replay system with analysis
- Puzzle marketplace
- Cross-platform cloud sync
- Esports tournament brackets

---

*Built with ❤️ for puzzle enthusiasts worldwide.*
