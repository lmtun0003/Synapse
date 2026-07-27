# Games

## Cursor Cloud specific instructions

### Repository layout (important)
- The `main` branch is effectively empty (only a `README.md` stub). The actual application code lives on feature branches.
- This branch (`cursor/synapse-game-foundation-81b8` and descendants) contains **SYNAPSE**, a React 19 + Vite + TypeScript + Tailwind logic-puzzle game, with `package.json` at the repo root.
- Another branch (`cursor/synapse-puzzle-game-0cb0`) contains a separate implementation nested under `synapse/`. If you work there, run the commands from inside `synapse/`.

### Running the app (SYNAPSE, this branch)
Standard commands are in `README.md` and `package.json` scripts. Quick reference:
- Dev server: `npm run dev` → serves at `http://localhost:5173/`.
- Tests: `npm test` (Vitest, `~43` unit tests on the pure `src/engine` logic).
- Lint: `npm run lint` (oxlint).
- Build: `npm run build` (`tsc -b && vite build`, emits a PWA bundle to `dist/`).

### Non-obvious notes
- Supabase is **optional**. The game runs fully offline; `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` (see `.env.example`) are only needed for cloud sync/leaderboards. Do not treat missing Supabase secrets as a blocker.
- Player progress is persisted in browser `localStorage` (Zustand persist). To retest a first-time flow, clear site data.
- `electron/main.js` is a desktop shell wrapper; primary development is the Vite web app.
- Dependencies pin very new major versions (React 19, Vite 8, TypeScript 6, Vitest 4). `npm ci` installs cleanly on Node 22.
