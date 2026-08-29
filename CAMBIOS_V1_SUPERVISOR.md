# Proyecto Piña — V1 Supervisores y gestión de materiales

## Alcance

Esta versión agrega un segundo nivel de acceso para el personal de la academia sin modificar la estructura actual de la base de datos.

### ADMIN
- Acceso total al panel.
- Gestiona materiales PDF.
- Gestiona categorías y subcategorías.
- Crea, elimina y restablece la contraseña de usuarios SUPERVISOR.
- Puede eliminar definitivamente materiales.

### SUPERVISOR
- Ingresa por el mismo `/login`.
- Puede crear y editar materiales.
- Puede cargar o reemplazar PDF y portada.
- Puede asignar categoría y subcategoría existentes.
- Puede publicar y despublicar materiales.
- No puede administrar categorías, subcategorías ni usuarios.
- No puede eliminar definitivamente materiales.

## Gestión de usuarios

Nueva sección: `/admin/usuarios`.

El ADMIN crea los supervisores indicando nombre, apellidos, correo y contraseña temporal. No existe registro público de supervisores.

## Archivos

- PDF obligatorio al crear un material: máximo 20 MB.
- Portada opcional: JPG, PNG o WEBP, máximo 5 MB.
- Los archivos continúan almacenándose en `../storage_pina`, fuera de cada versión desplegada.
- Se agregó validación de tipo/tamaño también en el servidor.

## Seguridad

- Las acciones de crear/editar materiales requieren ADMIN o SUPERVISOR.
- Eliminar material requiere ADMIN.
- Crear/editar/eliminar categorías y subcategorías requiere ADMIN.
- Crear/eliminar/restablecer supervisores requiere ADMIN.
- Las páginas de categorías, subcategorías y usuarios redirigen al panel si entra un SUPERVISOR.
- El login solo permite roles ADMIN o SUPERVISOR verificados.
- Se agregó `proxy.ts` en la raíz para la protección de `/admin` en Next.js 16.
- Se endureció la ruta pública de archivos para impedir rutas manipuladas y dejar de exponer rutas internas del servidor.

## Base de datos

No se requiere migración de Prisma para esta versión. El campo `Usuario.rol` ya es `String`; se reutilizan los valores:

- `ADMIN`
- `SUPERVISOR`

El administrador actual se conserva porque los usuarios siguen almacenados en la misma tabla `Usuario`.

## Variables de entorno

No se agrega ninguna variable obligatoria nueva.

Las variables `DATABASE_USER` y `DATABASE_PASSWORD` son credenciales de MySQL/MariaDB, no las credenciales del administrador de la web.

Las credenciales de acceso al panel están en la tabla `Usuario`:
- `email`: correo de inicio de sesión.
- `password`: hash bcrypt; la contraseña original no se puede leer directamente.
- `rol`: `ADMIN` o `SUPERVISOR`.

## Importante al desplegar

No borrar ni reemplazar la carpeta `storage_pina`. Esta carpeta contiene los PDF e imágenes persistentes cargados por el panel.
