# STAY frontend

Angular 20 (standalone komponenty, signals, OnPush) s Bootstrapom 5. Prehľad projektu je v [../README.md](../README.md).

```powershell
npm install
npm start                                              # http://localhost:4200
npx ng test --watch=false --browsers=ChromeHeadless
npx ng build
```

Texty sú v `src/app/core/i18n` (sk-SK, cs-CZ, en); farby v `src/styles/_theme.scss` ako sémantické tokeny pre light/dark.
