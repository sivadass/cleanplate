# CleanPlate React SPA

Vite + React + TypeScript consumer app for the local CleanPlate package.

The home page is a **Northstar** product workspace: one dashboard that uses every CleanPlate component in a shipping-team flow (projects table, activity, settings, and overlays).

## Setup

From the CleanPlate repo root, build the library first (the demo imports `cleanplate/dist`):

```bash
npm run build-package
```

Then install and run the demo:

```bash
cd demos/react-spa
npm install
npm run dev
```

`cleanplate` is linked with `"cleanplate": "file:../.."`. Rebuild the library after source changes, then refresh the demo.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run Oxlint |
