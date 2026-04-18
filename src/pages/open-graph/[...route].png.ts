import { Resvg } from '@resvg/resvg-js';
import { getCollection } from 'astro:content';
import { readFileSync } from 'fs';
import satori from 'satori';
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from '../../consts';

const fontRegular = readFileSync('./src/assets/fonts/atkinson-regular.woff');
const fontBold    = readFileSync('./src/assets/fonts/atkinson-bold.woff');

interface PageData {
	title: string;
	description: string;
}

const posts = await getCollection('blog', (p) => p.data.published !== false);
const tags  = [...new Set(posts.flatMap((p) => p.data.tags))];

const pages: Record<string, PageData> = {
	home:    { title: SITE_TITLE,  description: SITE_DESCRIPTION },
	blog:    { title: 'Blog',      description: 'Thoughts on software engineering and building scalable systems.' },
	resume:  { title: 'Resume',    description: 'My experience, projects, and skills.' },
	contact: { title: 'Contact',   description: 'Get in touch — always open to new ideas and opportunities.' },
	topics:  { title: 'Topics',    description: 'Browse all writing by topic.' },
	...Object.fromEntries(posts.map((p) => [`blog/${p.id}`, { title: p.data.title, description: p.data.description }])),
	...Object.fromEntries(tags.map((tag) => [`blog/topics/${tag}`, { title: `#${tag}`, description: `All articles tagged with "${tag}".` }])),
};

export function getStaticPaths() {
	return Object.keys(pages).map((route) => ({ params: { route } }));
}

function clamp(text: string, max: number) {
	return text.length > max ? text.slice(0, max - 1) + '…' : text;
}

async function generateOgImage(page: PageData): Promise<Buffer> {
	const svg = await satori(
		{
			type: 'div',
			props: {
				style: {
					display:         'flex',
					flexDirection:   'column',
					width:           '100%',
					height:          '100%',
					backgroundColor: '#0f172a',
					padding:         '60px 70px 50px 80px',
					borderLeft:      '22px solid #2563eb',
					fontFamily:      'Atkinson',
					boxSizing:       'border-box',
				},
				children: [
					// Main content — grows to fill space
					{
						type: 'div',
						props: {
							style: { display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', gap: '20px' },
							children: [
								{
									type: 'p',
									props: {
										style: { fontSize: 58, fontWeight: 700, color: '#f8fafc', margin: 0, lineHeight: 1.2 },
										children: clamp(page.title, 60),
									},
								},
								{
									type: 'p',
									props: {
										style: { fontSize: 26, color: '#94a3b8', margin: 0, lineHeight: 1.55 },
										children: clamp(page.description, 120),
									},
								},
							],
						},
					},
					// Footer row — domain
					{
						type: 'div',
						props: {
							style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
							children: [
								{
									type: 'span',
									props: {
										style: { fontSize: 20, color: '#475569', fontWeight: 400 },
										children: SITE_URL.replace('https://', ''),
									},
								},
								{
									type: 'span',
									props: {
										style: {
											fontSize:        14,
											color:           '#2563eb',
											border:          '1px solid #2563eb',
											padding:         '4px 14px',
											borderRadius:    '999px',
											fontWeight:      600,
											letterSpacing:   '0.05em',
											textTransform:   'uppercase',
										},
										children: 'Full Stack Engineer',
									},
								},
							],
						},
					},
				],
			},
		},
		{
			width:  1200,
			height: 630,
			fonts: [
				{ name: 'Atkinson', data: fontRegular, weight: 400, style: 'normal' },
				{ name: 'Atkinson', data: fontBold,    weight: 700, style: 'normal' },
			],
		},
	);

	return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}

export async function GET({ params }: { params: { route: string } }) {
	const page = pages[params.route];
	if (!page) return new Response('Not found', { status: 404 });
	const png = await generateOgImage(page);
	return new Response(png, { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' } });
}
