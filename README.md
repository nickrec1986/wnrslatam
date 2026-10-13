# WNRS Latam

Landing page estática de captación para WNRS Latam. Astro 4, una sola página, desplegada en GitHub Pages.

**Vista previa:** https://nickrec1986.github.io/wnrslatam/

El formulario abre un correo a `info@wnrs.com` (no hay backend en Pages). Teléfono: +52 55 5351 1693.

```bash
npm install
npm run dev
npm run build
```

El workflow `.github/workflows/deploy.yml` publica `dist/` en cada push a `main`. En el repo, Pages → Source debe ser **GitHub Actions**.
