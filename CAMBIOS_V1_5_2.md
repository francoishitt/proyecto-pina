# Cambios V1.5.2

Fecha: 12 de septiembre de 2026

## Hotfix de runtime en Hostinger
- Se añade `@swc/helpers` versión `0.5.15` como dependencia directa en `package.json`.
- Se actualiza el importador del `pnpm-lock.yaml` usando la misma versión 0.5.15 que ya estaba resuelta de forma transitiva en el lockfile.
- Se incrementa la versión del proyecto a `1.5.2`.

## Motivo
Los logs de producción muestran el error:

`Cannot find module '@swc/helpers/_/_interop_require_default'`

El paquete ya existía de forma transitiva en el lockfile, pero no estaba enlazado como dependencia directa de la aplicación en producción. Este hotfix fuerza su instalación/enlace a nivel del proyecto.

## Alcance
- Sin cambios visuales.
- Sin cambios en Prisma ni base de datos.
- Sin cambios en TikTok/Instagram.
- Sin migraciones SQL.

## Nota
Next.js permanece en `16.3.0` en este hotfix para no mezclar la recuperación del servicio con una actualización de framework. Tras confirmar que el sitio vuelve a responder, conviene hacer una segunda actualización separada a una versión de Next.js con los parches de seguridad vigentes.
