export const TAG1_VALUES = [
	'javascript',
	'typescript',
	'python',
	'php',
	'go',
	'rust',
	'css',
	'reflections',
	'career',
	'architecture',
	'ai',
	'open-source',
	'tech-advice',
] as const;

export const TAG2_VALUES = [
	'frontend',
	'backend',
	'tooling',
	'testing',
	'patterns',
	'performance',
	'security',
	'devops',
	'fundamentals',
	'advanced',
	'data',
] as const;

export const TAG3_VALUES = [
	'components',
	'state',
	'rendering',
	'hooks',
	'routing',
	'api',
	'database',
	'deployment',
	'authentication',
	'styling',
	'accessibility',
	'animation',
	'architecture',
	'events',
	'forms',
	'tooling',
	'fundamentals',
	'jsx',
	'patterns',
] as const;

export type Tag1 = typeof TAG1_VALUES[number];
export type Tag2 = typeof TAG2_VALUES[number];
export type Tag3 = typeof TAG3_VALUES[number];
