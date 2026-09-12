# Hotfix NPM V6 — despliegue limpio en Hostinger

Objetivo: cambiar el gestor de paquetes del despliegue de **pnpm** a **npm** sin tocar la lógica funcional de Proyecto Piña.

Cambios activos:
- Se eliminaron `pnpm-lock.yaml` y `pnpm-workspace.yaml`.
- `package.json` declara `packageManager: npm@10.9.2` y Node `22.x`.
- Se fijaron las dependencias directas a las mismas versiones que Hostinger instaló correctamente en el último build con pnpm, para evitar actualizaciones accidentales durante la prueba con npm.
- Se mantiene el cliente Prisma generado en `generated/prisma`.
- `next.config.mjs` conserva el trazado de SWC, React y React DOM y añade un trazado amplio de `node_modules/@prisma/**/*` para el runtime.

Configuración requerida en Hostinger:
- Framework: Next.js
- Node: 22.x
- Package manager: npm
- Build command: `npm run build`
- Output directory: `.next`

No se modifica la base de datos, el esquema de tablas, TikTok, Instagram ni el diseño del sitio.
