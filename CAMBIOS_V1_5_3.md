# Proyecto Piña V1.5.3 — Hotfix Hostinger / SWC runtime

## Motivo
El despliegue V1.5.2 arrancó Next.js correctamente, pero el artefacto de producción de Hostinger siguió fallando al resolver:

`@swc/helpers/_/_interop_require_default`

## Cambios
1. Se mantiene `@swc/helpers` como dependencia directa.
2. Se añade `.npmrc` con `node-linker=hoisted` para que pnpm genere un `node_modules` más plano y portable en el artefacto de Hostinger.
3. Se añade `outputFileTracingIncludes` en `next.config.mjs` para obligar a Next.js a incluir todos los archivos de `@swc/helpers` en los trazados de servidor.
4. No se modifica TikTok, Instagram, Prisma, la base de datos, las páginas públicas ni las variables de entorno.
5. Next.js permanece en 16.3.0 para aislar este cambio de despliegue.

## Verificación esperada
En el nuevo deployment, el runtime debe dejar de emitir `Cannot find module '@swc/helpers/_/_interop_require_default'`.
