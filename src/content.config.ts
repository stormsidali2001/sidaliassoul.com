import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { ALLOWED_TAGS } from "./lib/taxonomy";

const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),

  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      // Transform string to Date object
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: z.optional(image()),
      tags: z
        .array(z.string())
        .min(1, "At least 1 tag required")
        .max(3, "At most 3 tags allowed")
        .superRefine((tags, ctx) => {
          tags.forEach((tag, index) => {
            if (!(ALLOWED_TAGS as readonly string[]).includes(tag)) {
              ctx.addIssue({
                code: "custom",
                path: [index],
                message: `Invalid tag "${tag}". Must be one of the official dev.to tags.`,
              });
            }
          });
        }),
      series: z.string().min(1).optional(),
      seriesOrder: z.number().int().positive().optional(),
      published: z.boolean().default(true),
    }),
});

const education = defineCollection({
  loader: glob({ base: "./src/content/education", pattern: "**/*.md" }),
  schema: z.object({
    degree: z.string(),
    institution: z.string(),
    location: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    order: z.number(),
  }),
});

const contact = defineCollection({
  loader: glob({ base: "./src/content/contact", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    email: z.string().email(),
    linkedin: z.string().url(),
    github: z.string().url(),
    subtitle: z.string(),
    availabilityText: z.string(),
    platforms: z.array(
      z.object({
        name: z.string(),
        handle: z.string(),
        url: z.string().url(),
        icon: z.string(),
        group: z.enum(["direct", "code", "social", "freelancing"]),
      }),
    ),
  }),
});

const experience = defineCollection({
  loader: glob({ base: "./src/content/experience", pattern: "**/*.md" }),
  schema: z.object({
    role: z.string(),
    company: z.string(),
    location: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    stack: z.array(z.string()),
    order: z.number(),
  }),
});

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    github: z.string().url().optional(),
    liveUrl: z.string().url().optional(),
    stack: z.array(z.string()),
    featured: z.boolean().default(false),
    order: z.number(),
  }),
});

export const collections = { blog, education, contact, experience, projects };
