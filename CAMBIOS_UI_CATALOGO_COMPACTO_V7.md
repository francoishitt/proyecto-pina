# Hotfix UI V7 — Catálogo compacto

Base: V1.5.1 + runtime estable con npm (V6).

Cambios visuales únicamente en `/cursos`:

- Se reduce la altura del encabezado azul del catálogo.
- El título conserva jerarquía visual pero ocupa menos espacio vertical.
- El subtítulo usa un ancho mayor para evitar saltos de línea innecesarios en escritorio.
- Se reduce ligeramente el espacio superior del buscador lateral y de la grilla de resultados.
- No se modifica base de datos, Prisma, autenticación, TikTok, rutas, variables de entorno ni configuración de deployment.

Configuración de Hostinger que debe mantenerse:

- Node.js: 22.x
- Package manager: npm
- Build command: npm run build
- Output directory: .next
