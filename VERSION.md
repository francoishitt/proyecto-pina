# Versión actual

**1.5.3** — Hotfix Hostinger / trazado de @swc/helpers y pnpm hoisted.

# Proyecto Piña V1.5.2

Hotfix de ejecución para Hostinger sobre la base V1.5.1.

- Se agrega `@swc/helpers` 0.5.15 como dependencia directa de producción.
- El objetivo es evitar el error de runtime `Cannot find module '@swc/helpers/_/_interop_require_default'`.
- No se modifica la lógica, diseño, base de datos ni integraciones sociales.
- No requiere migraciones SQL.
- Next.js se mantiene temporalmente en 16.3.0 para aislar el hotfix; la actualización de seguridad se hará en un despliegue separado una vez recuperado el sitio.
