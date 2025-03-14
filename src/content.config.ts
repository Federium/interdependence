import { defineCollection, z } from "astro:content";
import {glob} from "astro/loaders";


const projects = defineCollection({
    loader: glob({pattern: "***/**/*.{md,mdx}", base: "src/projects"}),
    schema: z.object({
    id: z.number(),
    category: z.string(), // Categoria estratta dal percorso
    title: z.string(),
    subtitle: z.string(),
    project_website: z.string().transform((val) => {
      try {
        new URL(val);  // Verifica se è un URL valido
        return val;  // Se valido, restituisce il valore originale
      } catch {
        return 'none';  // Se non è valido, restituisce 'none'
      }
    }),
    school_website: z.string().transform((val) => {
      try {
        new URL(val);  // Verifica se è un URL valido
        return val;  // Se valido, restituisce il valore originale
      } catch {
        return 'none';  // Se non è valido, restituisce 'none'
      }
    }),
    degree: z.string(),
    course: z.string().optional(),
    ay: z.string(),
    team: z.array(z.string()),
    faculty: z.array(z.string()),
    university: z.string(),
    department: z.string(),
    city: z.string(),
    state: z.string(),
    school_instagram: z.string(),
  }),
});

export const collections = { projects };
