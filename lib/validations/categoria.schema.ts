import { z } from "zod";
export const categoriaSchema = z.object({
  nombre: z.string().min(2,"Mínimo 2 caracteres").max(100,"Máximo 100 caracteres"),
  slug: z.string().min(2,"Slug obligatorio").regex(/^[a-z0-9-]+$/,"Solo minúsculas, números y guiones"),
  descripcion: z.string().optional().nullable(),
  orden: z.coerce.number().int().min(0).max(999),
  visible: z.coerce.boolean(),
});
export type CategoriaFormData = z.infer<typeof categoriaSchema>;
