# STAY Development Conventions

- Support Slovak (`sk-SK`), Czech (`cs-CZ`), and English (`en`) from the start. Keep user-facing text ready for localization; do not hard-code it throughout components.
- Keep the codebase clean and modular. Apply DRY and SOLID principles; avoid spaghetti code.
- Reuse components when their behavior or presentation is shared.
- Place constants, interfaces, types, and enums in dedicated files rather than mixing them into components or services.
- Place every component in its own dedicated folder with its template, styles, and tests.
- Implement dark mode as a semantic color-token variant, not component-specific color overrides.

## Project context

STAY helps people cope with anxiety before, during, and after a situation. It is a self-help tool, not treatment: never use "therapy" or "treatment" wording. Content comes from evidence-based CBT/ACT techniques reviewed by a psychologist; generative AI is not part of the MVP. Mental-health data is GDPR Article 9 data.

- Monorepo: `backend/` (NestJS, ESM with `.js` import suffixes, Postgres via `pg` (Neon; PGlite in tests), vitest, oxlint) and `frontend/` (Angular, standalone, signals, OnPush). See `README.md` for structure and roadmap.
- Backend: protect routes with `@UseGuards(AuthGuard)` and read the account via `@CurrentUserId()`. DTOs live in `dto/`, interfaces in `models/`.
- Frontend: API URL and storage keys are in `core/api.constant.ts`; the auth interceptor adds the bearer token, so services must not set it manually. Add every new user-facing string to `TranslationKey` and all three languages in `core/i18n`.
- Validate with `npm run lint`, `npm test`, `npm run test:e2e` (backend) and `npx ng test --watch=false --browsers=ChromeHeadless` plus `npx ng build` (frontend). On Windows use `npm.cmd`/`npx.cmd` if execution policy blocks scripts.
