import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import { SITE_DESCRIPTION, SITE_TITLE } from "../consts";

// ←←← NEW IMPORTS
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";

// ←←← Create the parser once (outside the function)
const parser = new MarkdownIt();

export async function GET(context) {
  const posts = (await getCollection("blog"))
    .filter((p) => p.data.published !== false)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    customData: `<language>en-us</language>`,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
      categories: post.data.tags ?? [],

      // ←←← CHANGED: Convert Markdown → safe HTML (exactly what dev.to expects)
      content: sanitizeHtml(parser.render(post.body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          img: ["src", "alt", "title"],
        },
      }),
    })),
  });
}
