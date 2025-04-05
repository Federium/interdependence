import { defineCollection, z } from "astro:content";
import {glob} from "astro/loaders";


// Definizione della collection "projects"
const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "src/projects" }),
  schema: z.object({
    id: z.number(),
    slug: z.string(),
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
    degree: z.string().optional(),
    course: z.string().optional(),
    ay: z.string(),
    team: z.array(z.string()),
    faculty: z.array(z.string()),
    school: z.string(),
    hasVideo: z.string().optional().transform((val) => (val && val.trim() !== "" ? val : "false")),
    videoLink: z.string().optional(),
    images: z.array(z.string()).optional(),  // Array per le immagini
  }),
});

// Definizione della collection "images"
const images = defineCollection({
  loader: glob({ pattern: "*.md", base: "src/images_metadata" }), // Carica tutte le immagini nella cartella "img"
  schema: ({ image }) => z.object({
    category: z.string(), // La categoria del progetto
    id: z.number(), // ID del progetto
    images: z.array(image()), // Array dei percorsi delle immagini
  }),
});

export const collections = { projects, images };
