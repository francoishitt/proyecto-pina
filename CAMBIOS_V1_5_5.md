# V1.5.5 - Redeploy limpio con npm

Base: V1.5.1 original.

Cambios mínimos para despliegue en Hostinger:
- Se eliminaron `pnpm-lock.yaml` y `pnpm-workspace.yaml`.
- Se declaró `npm@10.9.2` como package manager.
- Se fijó Node.js 22.x.
- Se fijaron las versiones directas exactamente a las observadas en el último build de V1.5.1.
- No se modificó `next.config.mjs`.
- No se modificó TikTok, Instagram, Prisma, base de datos, diseño, rutas ni variables de entorno.

Objetivo: comprobar un despliegue limpio usando npm, sin los hotfixes V1.5.2/V1.5.3/V1.5.4.
