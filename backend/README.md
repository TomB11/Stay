# STAY backend

NestJS 12 API (ESM, importy s príponou `.js`) s Postgres (Neon) cez `pg`. Prehľad projektu je v [../README.md](../README.md).

```powershell
npm install
npm run start:dev      # http://localhost:3000/api
npm run lint
npm test
npm run test:e2e
```

Premenné: `PORT`, `FRONTEND_ORIGIN`, `DATABASE_URL` (načíta sa z `.env.local`, vytvorí ho `neon deploy`). Pri `NODE_ENV=test` sa používa PGlite (Postgres v pamäti).
