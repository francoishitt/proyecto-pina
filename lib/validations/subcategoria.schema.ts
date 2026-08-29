import { z } from "zod";
export const subcategoriaSchema = z.object({
  nombre: z.string().min(2,"Mínimo 2 caracteres").max(100,"Máximo 100 caracteres"),
  slug: z.string().min(2,"Slug obligatorio").regex(/^[a-z0-9-]+$/,"Solo minúsculas, números y guiones"),
  categoriaId: z.string().min(1,"Debes seleccionar una categoría"),
  orden: z.coerce.number().int().min(0).max(999),
  visible: z.coerce.boolean(),
});
export type SubcategoriaFormData = z.infer<typeof subcategoriaSchema>;
