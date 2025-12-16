import { z } from "zod";

export const profileSchema = z.object({
  nombre: z.string().min(2, "Nombre: mínimo 2 caracteres").max(60),
  apellido: z.string().min(2, "Apellido: mínimo 2 caracteres").max(60),
  email: z.string().email("Email inválido").max(120),
  cedula: z.string().regex(/^\d{10}$/, "Cédula inválida: deben ser 10 dígitos"),
  categoriaId: z.number().int().positive("CategoriaId inválido").optional(),
  disciplinaId: z.number().int().positive("DisciplinaId inválido").optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
