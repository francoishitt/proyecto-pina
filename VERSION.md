# Proyecto Piña V1.3 completa

Versión consolidada para reemplazar el contenido del repositorio GitHub.

## Roles

- **ADMIN**: control total; usuarios, categorías, subcategorías, materiales, perfil y eliminación definitiva de materiales.
- **SUPERVISOR**: administra la cinta de categorías y subcategorías; crea, edita, publica/despublica materiales PDF; no administra usuarios ni elimina materiales definitivamente.
- **EDITOR**: crea, edita, publica/despublica materiales PDF; no modifica categorías/subcategorías ni usuarios; no elimina materiales definitivamente.

## Funcionalidad de la cinta

Los nombres de categorías y subcategorías se siguen leyendo directamente de MySQL. ADMIN y SUPERVISOR pueden crear, editar o eliminar esos elementos desde el panel, y los cambios se reflejan en la navegación pública.

## Compatibilidad

- No requiere nuevas tablas ni columnas.
- No requiere migración SQL para pasar de V1.2 a V1.3.
- Los usuarios SUPERVISOR existentes conservan su cuenta y obtienen los nuevos permisos de estructura.
- Los nuevos EDITOR se crean desde ADMIN > Usuarios.
- No incluye archivos `.env` ni credenciales.
