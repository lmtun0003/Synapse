# SYNAPSE

**Every Move Changes Everything.**

A premium logic puzzle game — Monument Valley calm, Chess.com competition, Wordle ritual, Apple clarity.

## Play

```bash
npm install
npm run dev
```

```bash
npm test
npm run build
```

## Stack

| Layer | Choice |
| --- | --- |
| Frontend | React · TypeScript · Tailwind CSS · Framer Motion |
| State | Zustand (persisted progress) |
| Backend | Supabase-ready (auth, realtime, leaderboards, storage) |
| Testing | Vitest |
| Delivery | PWA · Electron shell · iOS/Android via Capacitor-ready web |

## Gameplay

Activate every node in the minimum moves. Nodes affect their neighbours through handcrafted mechanics:

Basic → Rotation → Mirrors → Gravity → Teleporters → Logic gates · Power links · Locked · Timed

Ratings: **Bronze · Silver · Gold · Perfect**

## Modes

- **Campaign** — handcrafted chapters that introduce mechanics gradually
- **Daily Puzzle** — identical seeded board worldwide
- **Endless** — deterministic procedural generation with scaling difficulty
- **Ranked** — Elo ladder (Bronze → Synapse)
- **Duel** — simultaneous solve; opponent progress only
- **Puzzle Creator** — validate solvability, share via code

## Economy

- **Sparks** (free) and **Prisms** (premium) — cosmetics only
- Themes, boards, animations, battle pass — never gameplay advantages

## Architecture

```
src/
  engine/          Pure puzzle logic (no UI)
  data/levels/     Handcrafted campaign
  stores/          Zustand: game, player, settings
  components/      UI + board rendering
  pages/           Modes & meta surfaces
  lib/             Audio, haptics, Elo, Supabase stub
supabase/          SQL migrations for cloud sync
electron/          Desktop shell
```

## Cloud

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, then apply `supabase/migrations/001_initial.sql`.

Offline play and local progress work without cloud configuration.

## Roadmap hooks

Guilds · seasonal tournaments · AI daily generation · esports · Twitch · replay analysis · puzzle marketplace · cross-platform progression — all designed against the pure `engine/` boundary and Supabase schema.
