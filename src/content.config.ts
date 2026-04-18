import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { TAG1_VALUES, TAG2_VALUES, TAG3_VALUES } from './lib/taxonomy';

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
			tags: z.array(z.string())
				.min(1, 'At least 1 tag required')
				.max(3, 'At most 3 tags allowed')
				.superRefine((tags, ctx) => {
					const [t1, t2, t3] = tags;
					if (!(TAG1_VALUES as readonly string[]).includes(t1)) {
						ctx.addIssue({ code: 'custom', path: [0],
							message: `Tag 1 "${t1}" must be one of: ${TAG1_VALUES.join(', ')}` });
					}
					if (tags.length >= 2 && !(TAG2_VALUES as readonly string[]).includes(t2)) {
						ctx.addIssue({ code: 'custom', path: [1],
							message: `Tag 2 "${t2}" must be one of: ${TAG2_VALUES.join(', ')}` });
					}
					if (tags.length >= 3 && !(TAG3_VALUES as readonly string[]).includes(t3)) {
						ctx.addIssue({ code: 'custom', path: [2],
							message: `Tag 3 "${t3}" must be one of: ${TAG3_VALUES.join(', ')}` });
					}
				}),
			series: z.string().min(1).optional(),
			seriesOrder: z.number().int().positive().optional(),
			published: z.boolean().default(true),
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

const experience = defineCollection({
	loader: glob({ base: './src/content/experience', pattern: '**/*.md' }),
	schema: z.object({
		role:      z.string(),
		company:   z.string(),
		location:  z.string(),
		startDate: z.coerce.date(),
		endDate:   z.coerce.date().optional(),
		stack:     z.array(z.string()),
		order:     z.number(),
	}),
});

const projects = defineCollection({
	loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
	schema: z.object({
		title:       z.string(),
		description: z.string(),
		github:      z.string().url().optional(),
		liveUrl:     z.string().url().optional(),
		stack:       z.array(z.string()),
		featured:    z.boolean().default(false),
		order:       z.number(),
	}),
});

export const collections = { blog, cv, contact, experience, projects };
