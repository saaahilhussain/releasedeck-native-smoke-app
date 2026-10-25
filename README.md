# ReleaseDeck native smoke app

Minimal, stateless Node.js application reserved for controlled ReleaseDeck native-deployment acceptance testing.

- Listens only on `127.0.0.1:4100`.
- Exposes `GET /health`.
- Uses no dependencies, secrets, persistent writes, databases, or external services.
- Loads an optional `.env` file through Node.js built-in behavior and shuts down gracefully on `SIGTERM`.

Run `npm test` for the local checks. Run `npm start` only in an explicitly approved environment.

This repository is intentionally not a FileShelter component.
