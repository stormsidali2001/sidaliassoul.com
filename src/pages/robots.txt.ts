import { SITE_URL } from '../consts';

export async function GET() {
	const body = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap-index.xml
`;
	return new Response(body, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
}
