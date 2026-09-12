# Hotfix Runtime V4

Cambio mínimo sobre Runtime V3:

- Se conservan los includes de `@swc/helpers`, `react` y `react-dom`.
- Se agregan `node_modules/.prisma/client/**/*` y `node_modules/@prisma/client/**/*` a `outputFileTracingIncludes`.
- No se cambia pnpm, Node, TikTok, la base de datos ni el esquema Prisma.

Motivo: el runtime de Hostinger reporta `Cannot find module '.prisma/client/default'` aunque `prisma generate` termina correctamente durante el build.
