# Cambios V1.4.6

## Redes sociales
- Añade **Cambiar cuenta** para TikTok e Instagram.
- Mantiene **Desconectar** como acción independiente.
- TikTok revoca, cuando es posible, el token anterior mediante el endpoint OAuth oficial antes de eliminar la conexión local.
- Después de cambiar/desconectar se invalidan Inicio, `/videos` y `/admin/videos`.
- Se muestra claramente qué cuenta está conectada y, si existe, su avatar y enlace al perfil.
- Se incorpora una advertencia para TikTok: si el navegador conserva la sesión de la cuenta anterior, debe elegirse otra cuenta en TikTok o cerrar esa sesión antes de autorizar.

## Base de datos
- No requiere SQL ni cambios de esquema.
