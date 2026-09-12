# Proyecto Piña V1.5.4 — Hotfix npm / Hostinger

## Motivo
El runtime de Hostinger siguió usando pnpm en V1.5.3 (las rutas del error continúan bajo `node_modules/.pnpm`) y el error cambió de `@swc/helpers` a `react`, señal de que el artefacto de producción sigue omitiendo dependencias.

## Cambios
- Se elimina `pnpm-lock.yaml`.
- Se elimina `pnpm-workspace.yaml`.
- Se elimina `.npmrc` específico de pnpm.
- Se declara `packageManager: npm@10.9.2`.
- Se fija Node.js 22.x en `engines`.
- Se fijan las versiones directas a las ya resueltas en V1.5.3 para evitar cambios accidentales al instalar con npm.
- Se mantienen los trazados de `@swc/helpers` y se añaden `react` y `react-dom` al trazado de runtime.

## Qué no cambia
- No se modifica TikTok ni Instagram.
- No se modifica Prisma ni el esquema de base de datos.
- No se cambia el diseño ni las páginas públicas.
- Next.js permanece en 16.3.0 durante este hotfix para aislar el problema de despliegue.

## Comprobación esperada
En el próximo Build Log de Hostinger debe aparecer npm y no pnpm. En el Runtime Log no deberían aparecer rutas `node_modules/.pnpm/...` ni errores `Cannot find module react` / `@swc/helpers`.
