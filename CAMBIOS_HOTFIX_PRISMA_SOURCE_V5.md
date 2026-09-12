# Hotfix Prisma Source V5

## Objetivo
Evitar que el runtime de Hostinger dependa del directorio oculto `node_modules/.prisma/client`, que el pipeline de despliegue está omitiendo.

## Cambios
- Prisma Client cambia de `prisma-client-js` a `prisma-client`.
- El cliente generado se escribe en `generated/prisma` dentro del proyecto.
- `lib/prisma.ts` importa `PrismaClient` desde `@/generated/prisma/client`.
- Se mantiene el `postinstall: prisma generate`, por lo que Hostinger genera el cliente antes del build.
- Se conserva el trazado explícito que ya resolvió SWC y React.
- No se cambia pnpm, Node 22, base de datos, modelos, migraciones ni lógica de la aplicación.
