# Cambios V1.4.1

## Corrección de build en Hostinger

Next.js 16 exige que un archivo con la directiva `"use server"` exporte únicamente funciones `async`.

En V1.4, `actions/configuracion.action.ts` exportaba `CONFIG_DEFAULT` como objeto. Esto provocaba:

`A "use server" file can only export async functions, found object.`

V1.4.1 deja `CONFIG_DEFAULT` como constante interna del módulo y mantiene como exports únicamente las Server Actions asíncronas.

## Base de datos

No hay cambios adicionales de esquema respecto de V1.4. Si `MIGRACION_V1_4.sql` ya se ejecutó sobre la base activa, no debe ejecutarse nuevamente.
