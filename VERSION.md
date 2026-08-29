# Proyecto Piña V1.4.1

Corrección de compilación de la V1.4 para Next.js 16.3.0.

- Corrige `actions/configuracion.action.ts`: un archivo `"use server"` ya no exporta el objeto `CONFIG_DEFAULT`.
- Mantiene sin cambios las funcionalidades de V1.4: configuración web, redes sociales, videos, roles y gestión de categorías/subcategorías.
- No requiere una nueva migración SQL si `MIGRACION_V1_4.sql` ya fue ejecutada.
