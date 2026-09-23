# AGENTS.md

pnpm monorepo. Japanese FDE knowledge base: Markdown content in `content/ja/` (Zod-validated frontmatter via `packages/content-core`) rendered by two "renderers": `apps/web` (Next.js 14 App Router, static export → GitHub Pages on push to `main`) and `apps/mobile` (Expo, reads a generated JSON). Repo name "PDE" is legacy; project identity is FDE.

## Commands

```bash
pnpm install                 # pnpm@10 via packageManager/corepack; Node >=20 (CI uses 22)
pnpm dev                     # web dev server on :3000
pnpm validate:content        # schema + cross-reference + template-existence checks (run after ANY content edit)
pnpm typecheck               # tsc -r across packages; this is the ONLY code-style gate (no ESLint/Prettier)
pnpm test                    # vitest, only packages/content-core/tests/**
pnpm vitest run packages/content-core/tests/schema.test.ts   # single test file
pnpm test:e2e                # = build:mobile-content && build:web && playwright test (chromium only)
pnpm exec playwright test e2e/site.spec.ts                   # single e2e file
pnpm exec playwright install chromium        # first-time e2e setup
pnpm build:mobile-content    # regenerate committed artifacts (see below)
```

CI order: `validate:content` → `typecheck` → `test` → `build:web` → `build:mobile-content`; e2e job runs after a full site build.

## Standing rule: E2E closes every round

Before reporting any change as done, run `pnpm exec playwright test` (25 tests: pages, diagrams, link crawl, RSS/llms.txt) and report the result. `pnpm exec playwright test` only replays the existing `out/` build and is safe to run while `pnpm dev` is up; the full `pnpm test:e2e` rebuilds content+web and must follow the `.next` gotcha above (restart dev afterwards).

**Every new feature or major change additionally requires screenshot verification**: run `pnpm shot` (scripts/screenshot.mjs) to capture key pages (desktop light/dark + mobile) with runtime-error detection into `screenshots/`, visually inspect the affected pages, and confirm zero pageerrors before reporting. Order per round: build (if needed) → `pnpm exec playwright test` → `pnpm shot` + visual check → then report.

## Generated files are committed to git

`pnpm build:mobile-content` rewrites tracked files: `apps/mobile/src/data/content.json`, `apps/web/public/feed.xml`, `apps/web/public/llms.txt`. After content changes, regenerate and commit them or RSS/llms.txt go stale (E2E asserts on some of these).

## Content rules (CI-enforced)

- Adding content = copy a template; no code changes needed. New domain: copy `content/ja/domains/_template/` to `domains/<id>/`, fill `meta.json`, add a CODEOWNERS line.
- `_`-prefixed dirs/files are templates: never rendered, and CI asserts they exist — don't delete or rename them.
- Frontmatter schemas live in `packages/content-core/src/schema.ts` (human reference: `docs/content-model.md`). Changing the schema needs an RFC and backward compatibility.
- ids are kebab-case (`^[a-z0-9]+(-[a-z0-9]+)*$`) and immutable after creation — they are URL segments.
- `validate:content` checks link/reference integrity; broken internal links fail it.
- Page status lifecycle: `draft` → `reviewed` → `approved`.

## E2E gotchas

- `e2e/links.spec.ts` crawls every internal link from the major pages; a broken/unlinked new page fails E2E.
- Playwright serves the built `apps/web/out` via `scripts/serve-static.mjs` on :4173. Set `E2E_BASE_URL` to test a deployed site instead of a local build (skips the webServer).
- **Never run `pnpm build:web` while `pnpm dev` is running** — both write `apps/web/.next`, and the production build corrupts the dev incremental cache (browser shows `TypeError: ... reading 'call'` from webpack chunks). After any production build, `rm -rf apps/web/.next` and restart dev. Note E2E/typecheck do NOT catch this: they validate the static `out/` build, not the dev server.
- **Restarting dev requires killing the whole process tree** (`pnpm dev` → `sh -c next dev` → `next dev` → `next-server`). Killing only `next-server` lets the parent respawn it — leftover trees share `.next` and corrupt each other's chunks. Kill by port (`kill -9 $(lsof -ti tcp:3000)`) plus `pkill -9 -f "next dev"`, then verify `ps` shows 0 processes and port 3000 is free before starting again. `pnpm shot` detects stale-chunk breakage (HTTP ≥400 on `_next` assets, requestfailed, pageerror) and fails on it.

## Domain features (context for future work)

- **市場追跡**: `scripts/collect-market-data.mjs` appends a snapshot to
  `data/market-history.json` (weekly cron `.github/workflows/market-batch.yml`,
  Monday 12:00 JST). Home charts + fishbone read the JSON at build time.
  freelance-start requires the Playwright fallback (bot protection, HTTP 202);
  levtech + freelance-board are plain fetch. Manual entry: `--manual --fs N ...`.
- **ベンダー動向** (`/vendors`): renders `data/it-vendors.json` — add/update
  vendors in the JSON only, no code changes. Linked from nav and llms.txt.
- **HF Space deploy**: `deploy-hf.yml` uploads `apps/web/out` to
  `jackywangsh/fde-knowledge-base` (Static Space) using secret `HF_TOKEN`.
  GOTCHA: out/ contains a binary (opengraph-image, no extension) — plain git
  push to HF is rejected ("contains binary files"); must upload via
  huggingface_hub (hf_xet). Use scripts/deploy-hf.py / deploy-hf.sh.

## Env vars

- `PDE_CONTENT_DIR` — override content root (otherwise content-core walks up from cwd to find `content/`; default locale `ja`).
- `PDE_BASE_PATH` (+ `NEXT_PUBLIC_BASE_PATH`, `NEXT_PUBLIC_SITE_URL`) — set by CI for the GitHub Pages build (`/PDE-AI-Knowledge-Base`). Note: `docs/architecture.md` says `FDE_BASE_PATH`, but `apps/web/next.config.mjs` actually reads `PDE_BASE_PATH`.
