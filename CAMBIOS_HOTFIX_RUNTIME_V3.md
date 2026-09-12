# Hotfix runtime v3

Cambio mínimo sobre el hotfix SWC v2.

- Se mantiene `@swc/helpers` en el trazado de runtime.
- Se añaden `react` y `react-dom` a `outputFileTracingIncludes` para evitar que Hostinger los omita del artefacto de producción.
- No se cambia pnpm, Prisma, TikTok, Instagram, base de datos ni diseño.
