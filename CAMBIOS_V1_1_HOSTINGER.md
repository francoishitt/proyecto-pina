# Proyecto Piña V1.1 – corrección de build en Hostinger

Cambios aplicados:

- `/cursos` se fuerza a renderizado dinámico para evitar consultas a MariaDB durante `next build`.
- La portada `/` también se fuerza a renderizado dinámico porque `CursosRecientes` consulta Prisma.
- Se eliminaron de `next.config.mjs` las claves obsoletas `eslint` y `experimental.turbopack` que Next.js 16 reportaba como inválidas.
- Se agregó `metadataBase` usando `NEXT_PUBLIC_SITE_URL` para eliminar la advertencia de URLs sociales basadas en localhost.
- No se cambió el esquema Prisma ni la base de datos.
- Se conserva la funcionalidad ADMIN + SUPERVISOR de la V1.
