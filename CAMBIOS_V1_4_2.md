# Proyecto Piña V1.4.2

Correcciones de estabilidad y publicación:

- Login reconstruido sin hidratación React ni Server Action en el navegador.
- Login usa POST tradicional a `/api/auth/login`, crea cookie y redirige al panel.
- `/login` y `/admin` se sirven sin caché para evitar versiones antiguas después de un deployment.
- La web pública fuerza lectura dinámica/no-store de categorías, subcategorías y configuración.
- Al guardar categoría o subcategoría se hace recarga completa del panel para confirmar el dato recién persistido.
- Configuración web muestra confirmación y recarga tras guardar.
- Se incluye únicamente la migración SQL segura/idempotente V1.4.

No requiere nueva migración si V1.4 ya fue aplicada correctamente.
