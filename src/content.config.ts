import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			tags: z.array(z.string()).optional().default([]),
			series: z.string().min(1).optional(),
			seriesOrder: z.number().int().positive().optional(),
		}),
});

const cv = defineCollection({
	// Load Markdown files in the `src/content/cv/` directory.
	loader: glob({ base: './src/content/cv', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: z.object({
		name: z.string(),
		headline: z.string(),
		location: z.string(),
		email: z.string(),
		phone: z.string(),
		website: z.string(),
		social_networks: z.array(z.object({
			network: z.string(),
			username: z.string(),
		})),
	}),
});

const contact = defineCollection({
	loader: glob({ base: './src/content/contact', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		email: z.string().email(),
		linkedin: z.string().url(),
		github: z.string().url(),
		subtitle: z.string(),
		availabilityText: z.string(),
		platforms: z.array(z.object({
			name: z.string(),
			handle: z.string(),
			url: z.string().url(),
			icon: z.string(),
			group: z.enum(['direct', 'code', 'social', 'freelancing']),
		})),
	}),
});

export const collections = { blog, cv, contact };
