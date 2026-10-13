# WNRS Latam

Landing de captación para WNRS Latam. Astro 4, una página, desplegada en GitHub Pages.

**Vista previa:** https://nickrec1986.github.io/wnrslatam/

El formulario califica en dos pasos, empuja `lead_submit` al `dataLayer` y redirige a `/gracias/`. El envío vive en `src/lib/lead.ts` para conectar HubSpot después. WhatsApp y teléfono: +52 55 5351 1693.

```bash
npm install
npm run dev
npm run build
```

`.github/workflows/deploy.yml` publica `dist/` en cada push a `main`. Pages → Source: **GitHub Actions**.
