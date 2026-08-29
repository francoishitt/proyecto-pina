# V1.2 - Corrección de carga de /login

- Se eliminó la consulta de sesión/Prisma durante el render inicial de `/login`.
- El formulario de acceso vuelve a poder renderizarse sin depender de una conexión a MySQL.
- La validación real contra MySQL sigue ocurriendo al enviar correo y contraseña.
- Esto permite diagnosticar por separado si el problema restante es de conexión, esquema o credenciales.
