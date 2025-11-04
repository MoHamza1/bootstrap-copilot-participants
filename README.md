# Copilot GMQE

Prototype scaffolding for a VS Code extension that coordinates multiple chat participants with specialized responsibilities.

The implementation is organized to isolate host extension wiring, participant definitions, and integration adapters. Each area will grow independently while keeping shared types discoverable.

## Repository Layout

- `src/extension.tsx` entry point for the extension host.
- `src/adapters` bridge layer for VS Code APIs (tree views, command registrations, chat shims).
- `src/core` shared runtime for participant registration, routing, and diagnostics.
- `src/participants` participant implementations plus scaffolding utilities.
- `src/config/participants.json` declarative participant metadata used at activation time.

## Next Steps

1. Implement the extension activation routine in `src/extension.tsx`.
2. Flesh out the adapter modules under `src/adapters`.
3. Define participant behaviors and chat flows under `src/participants`.
