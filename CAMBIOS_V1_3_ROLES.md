# Cambios V1.3 — Roles y gestión de la cinta

## ADMIN
- Control total del sistema.
- Crea SUPERVISOR y EDITOR.
- Puede cambiar el rol de un usuario operativo entre SUPERVISOR y EDITOR.
- Restablece contraseñas y elimina accesos.
- Gestiona categorías, subcategorías y materiales.
- Mantiene la eliminación definitiva de materiales.

## SUPERVISOR
- Ve Panel, Materiales, Categorías, Subcategorías y Perfil.
- Crea, edita y elimina categorías/subcategorías, con protección de relaciones existentes.
- Crea, edita, reemplaza PDF/portada, publica y despublica materiales.
- No ve ni administra Usuarios.
- No elimina materiales definitivamente.

## EDITOR
- Ve Panel, Materiales y Perfil.
- Crea, edita, reemplaza PDF/portada, publica y despublica materiales.
- No ve Categorías, Subcategorías ni Usuarios.
- No elimina materiales definitivamente.

## Seguridad de servidor
- Los permisos no dependen solo de ocultar enlaces.
- Las acciones de categorías/subcategorías exigen ADMIN o SUPERVISOR.
- Las acciones de materiales exigen ADMIN, SUPERVISOR o EDITOR.
- La eliminación definitiva de materiales sigue exigiendo ADMIN.
- La administración de usuarios sigue exigiendo ADMIN.

## Base de datos
No hay cambios estructurales en MySQL; `Usuario.rol` ya es un campo String, por lo que el nuevo valor `EDITOR` funciona sin migración.
