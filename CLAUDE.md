# CLAUDE.md

This project's working agreement for AI agents lives in [`AGENTS.md`](AGENTS.md).
The full specification is in [`docs/SPEC.md`](docs/SPEC.md). Read both before making changes.

Quick reminders:
- Hebrew RTL product; never over‑state food safety; keep domain logic shared & pure.
- Run `npm run verify` (unit → build → e2e) before finishing.
- Never commit secrets (`.dev.vars`, `.admin-key.txt`, `.cloudflare-token.txt` are gitignored).
