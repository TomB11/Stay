# STAY

STAY je webová aplikácia, ktorá pomáha ľuďom zvládať úzkosť v troch situáciách:

| Fáza | Kedy | Cieľ |
|------|------|------|
| **Before** (Pred) | Úzkosť z toho, čo ešte príde | Pomenovať obavu a určiť prvý malý krok |
| **Now** (Teraz) | Úzkosť práve prebieha | Rýchle upokojenie tela a pozornosti |
| **After** (Po) | Spätné prežúvanie situácie | Oddeliť fakty od interpretácií |
| **Unsure** | Neviem, čo to je | Všeobecný krátky grounding |

Aplikácia je **nástroj podpory a sebapomoci, nie liečba ani náhrada odbornej pomoci**. Podporuje slovenčinu (`sk-SK`), češtinu (`cs-CZ`) a angličtinu (`en`).

## Smer produktu

- Obsah vychádza z overených techník KBT/ACT (dych, grounding, kognitívna reštrukturalizácia, expozičný rebríček, denník), nie z generatívnej AI.
- Všetky texty musí odborne skontrolovať psychológ (SK/CZ).
- AI môže prísť neskôr len ako voliteľná, ohraničená vrstva.
- Údaje o duševnom zdraví sú osobitná kategória podľa GDPR (čl. 9).

## Štruktúra

```
backend/    NestJS 12 API (ESM), Postgres (Neon) cez `pg`, vitest, oxlint
frontend/   Angular 20 (standalone, signals, OnPush), Bootstrap 5, Karma
AGENTS.md   Konvencie vývoja
```

### Backend (`backend/src`)
- `auth/` – registrácia, prihlásenie (scrypt), krátky access token (30 min) a rotujúci refresh token (30 dní) uložené ako SHA-256 hash v Postgrese, `POST /auth/refresh` a `/auth/logout` (odvolanie), `AuthGuard`, `@CurrentUserId()`, limit 10 pokusov/min
- Účet (GDPR): registrácia vyžaduje súhlas so spracovaním údajov a potvrdenie veku 16+ (ukladá sa čas súhlasu), `GET /auth/export` a `DELETE /auth/account` (kaskádové zmazanie); v profile ich ovláda `account-settings`
- Globálne: `ValidationPipe` (whitelist, DTO cez class-validator), `ThrottlerGuard` (120 požiadaviek/min), `helmet`
- `sessions/` – ukladanie a výpis dokončených check-inov (vyžaduje token)
- `exposure/` – expozičný rebríček: kroky (0–10) a pokusy pred/po, max 30 krokov na účet, vlastníctvo sa overuje pri každom volaní, zahrnuté v exporte a kaskádovom zmazaní
- `diary/` – denník úzkosti (záznam myšlienok: situácia, myšlienka, emócia, intenzita pred/po, alternatíva), max 1000 záznamov, v exporte a kaskádovom zmazaní
- `database/` – Postgres pripojenie (`pg`, Neon) a schéma; v teste PGlite (Postgres v pamäti)
- API prefix `/api`: `GET /health`, `POST /auth/register`, `POST /auth/login`, `POST|GET /sessions`, `GET|POST /exposure`, `POST /exposure/:id/attempts`, `DELETE /exposure/:id`, `GET|POST /diary`, `DELETE /diary/:id`, `GET /insights`, `GET|POST /rewards`, `POST /rewards/open`, `POST /rewards/:id/redeem`, `DELETE /rewards/:id`

### Frontend (`frontend/src/app`)
- `components/` – každý komponent vo vlastnom priečinku (šablóna, štýly, test)
- `components/session-flow/` – priebeh pre Pred/Po: výber fázy → popis a intenzita → vedené cvičenie (`guided-exercise`, kroky v `sessions/constants/guided-steps.constant.ts`) → check-in → zhrnutie. Fáza „Neviem“ zostáva pri jednovetovej podpore.
- `components/now-support/` – režim Teraz (`/now`): `breathing-guide`, `grounding-guide`, `relaxation-guide`, `crisis-help`
- `components/rewards/` – „Moje odmeny“ (súčasť `/progress`): používateľ si pridá vlastné odmeny (káva, kino, výlet), za každých 5 krokov odvahy (cvičenie, záznam v denníku, pokus na rebríčku; `GIFT_EVERY_ACTIONS`) získa darček a náhodne sa otvorí jedna zabalená odmena. Obsah zabalených odmien API neposiela. Odmeňuje sa snaha, nie pokles úzkosti, a nie je tam žiadna séria, ktorú by bolo možné „stratiť“.
- `components/progress/` – „Môj pokrok“ (`/progress`): trend úzkosti, účinok cvičení a denníka, rebríček, séria dní, odporúčanie odbornej pomoci (prahy v `backend/src/insights/constants` čakajú na schválenie psychológom)
- `components/app-header/` – hlavička: skupina jazyk + vzhľad (SVG ikony), skupina účtu a navigácia pre prihláseného
- `components/diary/` – denník úzkosti (`/diary`, po prihlásení); krízová detekcia beží nad textom formulára
- `components/exposure-ladder/` – expozičný rebríček (`/ladder`, po prihlásení): kroky od najľahšieho, zvýraznený „ďalší krok“, krok sa berie ako zvládnutý, keď posledný pokus skončil na úzkosti ≤ 3 (`exposure/exposure-progress.ts`)
- `core/crisis/` – detekcia krízových fráz vo voľnom texte (`crisis-detector.ts`, vzory v `crisis-patterns.constant.ts`); beží len v prehliadači, text sa nikam neposiela. Pri zhode sa ukáže `crisis-alert` s kontaktmi (nebráni pokračovaniu).
- `now/` – modely a konštanty režimu Teraz (dych, grounding, svalové uvoľnenie, krízové kontakty)
- `core/` – API, autentifikácia (interceptor pridáva token), téma (light/dark cez sémantické tokeny), `i18n/`
- `sessions/` – modely, typy a konštanty (texty podpory pre každú fázu)

## Spustenie

```powershell
cd backend;  npm install; npm run start:dev   # http://localhost:3000/api
cd frontend; npm install; npm start           # http://localhost:4200
```

Premenné prostredia backendu: `PORT`, `FRONTEND_ORIGIN`, `DATABASE_URL` (Neon, v `backend/.env.local`, nikdy necommitovať).

## Nasadenie (zadarmo)

- **Databáza:** Neon (Postgres, región EÚ).
- **Backend:** Render podľa `render.yaml` (Blueprint). Nastav `DATABASE_URL` (z Neonu) a `FRONTEND_ORIGIN` = pôvod GitHub Pages bez cesty, napr. `https://tomb11.github.io`.
- **Frontend:** GitHub Pages cez `.github/workflows/pages.yml` (push do `main`). V repozitári zapni Settings → Pages → Source: GitHub Actions.
- Produkčný frontend volá absolútnu URL z `frontend/src/environments/environment.production.ts`; ak sa Render URL líši od `stay-backend-e716.onrender.com`, uprav ju.
- Free Render po nečinnosti zaspí, prvé volanie je pomalšie.
## Testy a kontrola

```powershell
cd backend;  npm run lint; npm test; npm run test:e2e
cd frontend; npx ng test --watch=false --browsers=ChromeHeadless; npx ng build
```

Na Windows môže `npm`/`npx` blokovať execution policy; použite `npm.cmd` / `npx.cmd`.

## Stav a ďalšie kroky

Hotové: autentifikácia, história, tri jazyky, dark mode, tok Pred/Po a **režim Teraz (`/now`)**: bez prihlásenia a bez písania, okamžite spustí dych 4 s/6 s (2 min, animácia + vibrácia, rešpektuje `prefers-reduced-motion`), potom otázka „Je to ľahšie?“ → pokračovať v dychu / grounding 5-4-3-2-1 / progresívne svalové uvoľnenie (5 skupín, napnúť 5 s, pustiť 10 s) / krízová pomoc. Krízové kontakty sú v `frontend/src/app/now/constants/crisis-contacts.constant.ts` (čísla treba pred vydaním overiť).

Zostáva (podľa priority):
1. **Bezpečnosť a krízy:** psychológom schválený a rozšírený zoznam krízových fráz, overenie krízových čísel.
2. **Obsah:** hotový expozičný rebríček a denník úzkosti; hotová stránka „Môj pokrok“; zostáva chladový podnet, worry time a kontrola všetkých textov psychológom. Texty denníka sú v databáze zatiaľ nešifrované (šifrovanie citlivých polí je v bode 3).
2a. **Odpovede z vedených cvičení sa zatiaľ neukladajú** (ostávajú len v pamäti prehliadača). Ak sa majú ukladať do denníka, treba šifrovanie a súhlas.
2b. **Režim Teraz offline:** hotové ako PWA (Angular service worker, `ngsw-config.json`, `manifest.webmanifest`, aktívny len v produkčnom builde; po prvej návšteve funguje `/now` bez siete a dá sa pridať na plochu). Zostáva voliteľné uloženie do histórie po dokončení.
3. **Backend:** šifrovanie citlivých polí, migrácie schémy, throttler za proxy (nastaviť `trust proxy`), CORS pre produkciu. Refresh tokeny a odhlásenie na serveri sú hotové.
5. **Pokrok:** trendy intenzity, spúšťače, čo pomohlo; história len vypisuje záznamy.
6. **Frontend:** `API_BASE_URL` do environment konfigurácie, lazy routes, profil a nastavenia sú len placeholdery, jazyk sa ukladá a predvolí podľa prehliadača, a11y audit, migrácia `@import` v SCSS na `@use`.
7. **Testy:** chýbajú unit testy backendových služieb a guardu, testy `ApiService`, interceptora a `SessionFlowComponent`.
8. **Právo a prevádzka:** stránky `/privacy` a `/terms` sú hotové (sk/cs/en, odkazy v pätičke a pri súhlase pri registrácii), no pred spustením treba doplniť údaje prevádzkovateľa (placeholder v `privacyS1Body`) a nechať texty skontrolovať právnikom. Zostáva CI.
