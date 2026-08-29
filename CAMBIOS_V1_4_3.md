# Proyecto Piña V1.4.3

## Corrección crítica de redirecciones en Hostinger

Hostinger ejecuta internamente la aplicación Next.js en `0.0.0.0:3000`. En V1.4.2 el endpoint de login construía la redirección posterior al inicio de sesión con `request.url`, por lo que el navegador terminaba en `https://0.0.0.0:3000/admin`.

### Cambios
- `/api/auth/login` usa `NEXT_PUBLIC_SITE_URL` para redirigir a `/admin` y para devolver errores a `/login`.
- `proxy.ts` usa el origen público para redirecciones de autenticación.
- `lib/middleware.ts` queda alineado por seguridad/compatibilidad.
- Si `NEXT_PUBLIC_SITE_URL` no estuviera configurado, se intenta recuperar el origen externo mediante `x-forwarded-proto` y `x-forwarded-host`.

### Variable requerida en Hostinger
`NEXT_PUBLIC_SITE_URL=https://proyectopiña.com`

No requiere cambios SQL.
