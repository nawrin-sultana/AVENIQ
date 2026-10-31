# AVENIQ
**Intelligence That Moves Revenue Forward.**

A portfolio MVP of an AI-native revenue intelligence and CRM decision workspace, built with Next.js App Router + TypeScript + Recharts. Its public demo runs entirely from reproducible, synthetic Salesforce-style data. No external CRM or LLM credentials are necessary.

## Quick start
```bash
npm install
npm run dev
```
Open http://localhost:3000. The environment requires Node.js 20+. Run `npm run lint` for TypeScript validation and `npm test` for engine unit tests.

## Delivered workflows
- **Overview:** calculated ARR, revenue exposure, open weighted pipeline, illustrative expansion opportunity; customer health chart; segment filtering.
- **Accounts:** searchable account directory, account detail drawer, explainable customer-health contributions and associated actions.
- **Revenue Risks / Growth Opportunities:** inspect and accept/dismiss actionable CRM signal recommendations; status retained in browser localStorage.
- **Revenue War Room:** choose account and compare sales, marketing, and customer-success evidence from shared data; view orchestrated action plan. **Deterministic specialist views, not real multi-agent LLM execution.**
- **Marketing Intelligence:** computed campaign aggregates and channel chart from synthetic records. **Influenced pipeline may be counted in more than one campaign.**
- **Scenario Simulator:** change churn exposure reduction, expansion conversion, win-rate uplift, and ACV assumptions with live calculated results.
- **Ask AVENIQ:** conversational query patterns grounded in synthetic account, opportunity, and campaign records; deterministic responses with supporting record IDs. **No external AI API is called.**
- **Settings:** role selector, dark/light themes, browser-persisted recommendation status, CSV validation route with error reporting. **CSV imports are validated but not persisted.**

## Dataset & reproducibility
`lib/engine.ts` uses a seeded pseudorandom generator to produce exactly 500 accounts, 1,000 contacts, 750 opportunities, 2,000 activities, 300 support cases, and 100 campaigns, along with 500 subscriptions and 500 renewals. The same seed reproduces the same records and all linked IDs reference valid accounts. The default API `/api/data` returns this data; it is regenerated deterministically per request.

## Optional PostgreSQL schema and seed
The `prisma/schema.prisma` and `prisma/seed.ts` files provide an optional persisted model, **not the source of data for the default demo**. Once PostgreSQL is provisioned:
```bash
cp .env.example .env
# replace DATABASE_URL with your local Postgres instance
npx prisma generate
npx prisma db push
npm run seed
```
To make database records authoritative, replace `/api/data` with Prisma read queries, add scoped RBAC, implement server-side recommendation persistence, and introduce tenancy. Production infrastructure is intentionally not claimed as complete.

## Important interpretation limits
- Customer health scores are deterministic heuristics, not validated probabilities of churn.
- Revenue at risk = 65% of ARR for accounts whose score is below 50, an illustrative exposure assumption.
- Expansion signal value = 20% of qualifying account ARR; not contractual pipeline.
- Weighted pipeline = sum of open opportunity amount × fixed illustrative stage probability.
- Executive trend line is an **illustrative reconstruction** from present metrics, not observed month-by-month history.
- Browser-local recommendation state does not sync between devices and is not a server-audited CRM write.
- Uploading a CSV validates it without persisting records. Basic MVP CSV parser does not support embedded commas/quoted fields.
- Customer usage/engagement/CSAT fields are synthetic and do not represent real customers.

## Production roadmap
1. PostgreSQL data layer as the application's source of truth; authentication, organization tenancy and role-based permissions.
2. Salesforce OAuth integration, incremental sync and rate-limited webhook workers; audit logs and consent policies.
3. Documented data contracts, coverage metrics, backtesting, and explainable calibrated risk models.
4. Grounded LLM agent orchestration with record-level retrieval, deterministic metric computation, prompt injection defenses, citations and user approvals.
5. CSV import preview/commit, editing/assignment workflows, real history snapshots, robust attribution deduplication, end-to-end tests and deployment CI.

See `docs/ARCHITECTURE.md`, `docs/SCORING.md`, and `docs/DEMO.md`.
