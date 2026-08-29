# V1.4 — CMS + redes sociales

## Antes del redeploy
1. Subir esta versión a GitHub.
2. En phpMyAdmin de la BD activa, ejecutar `MIGRACION_V1_4.sql` una sola vez.
3. En Hostinger conservar las variables de BD y agregar cuando estén disponibles:
   - `TIKTOK_CLIENT_KEY`
   - `TIKTOK_CLIENT_SECRET`
   - `INSTAGRAM_APP_ID`
   - `INSTAGRAM_APP_SECRET`
4. TikTok: registrar callback `https://proyectopiña.com/api/social/tiktok/callback` y solicitar `user.info.basic,video.list`.
5. Instagram: cuenta Business/Creator, registrar callback `https://proyectopiña.com/api/social/instagram/callback` y habilitar Instagram Login.

## Cambios
- Configuración web editable con botón Guardar.
- WhatsApp, teléfono, dirección, email y URLs de Facebook/Instagram/TikTok/YouTube.
- Categorías/subcategorías: nombre, orden, visibilidad y Guardar cambios.
- Conexión automática TikTok/Instagram.
- `/videos` + videos recientes en Inicio.
- Los videos permanecen en las redes; no consumen almacenamiento del hosting.
