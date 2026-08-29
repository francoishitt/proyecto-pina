# Proyecto Piña V1.4.4

- Corrige la marca visible del hero a **ACADEMIAS PROYECTO PIÑA**.
- Cambia la etiqueta superior a “Preparación Preuniversitaria”.
- Ajusta metadata y pie de página a la marca plural.
- Mejora **Videos y redes** con datos exactos de Redirect URI para TikTok e Instagram.
- Agrega mensajes de conexión/error de OAuth en el panel.
- Mejora logs de errores de TikTok para diagnosticar Client Key, Secret, Redirect URI y scopes.
- Mantiene TikTok Login Kit + Display API con scopes `user.info.basic,video.list`.
- No requiere SQL adicional.
- La página `/videos` carga automáticamente hasta 60 publicaciones recientes y TikTok pagina internamente la API (20 por solicitud).
