# CleanPlate HTML app

Static HTML consumer demo for the local CleanPlate package. Markup uses public `cp-*` CSS classes and `data-cp` attributes (the HTML prototype contract). A small vanilla script wires overlays, filters, and toasts.

The page is the same **Northstar** product workspace as `demos/react-spa`: one dashboard that uses every CleanPlate component in a shipping-team flow.

## Setup

From the CleanPlate repo root, build the library first (the demo imports `cleanplate/dist/index.css`):

```bash
npm run build-package
```

Then install and run the demo:

```bash
cd demos/html-app
npm install
npm run dev
```

`cleanplate` is linked with `"cleanplate": "file:../.."`. Rebuild the library after source changes, then refresh the demo.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build |
