import { format } from "date-fns";
import { getMetadata } from "$lib/markdownConverter";
import { getPosts } from "$lib/postsReader";
import * as info from "$lib/info";

const render = (pages, posts) => `<?xml version="1.0" encoding="UTF-8" ?>
<urlset
  xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
  xmlns:xhtml="https://www.w3.org/1999/xhtml"
  xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
  xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
  xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
>
  <url>
    <loc>${info.canonical}</loc>
    <lastmod>${format(new Date(), "yyyy-MM-dd")}</lastmod>
    <changefreq>monthly</changefreq>
  </url>
  ${pages
		.map(
			(page) => `
  <url>
    <loc>${info.url}/${page}</loc>
  </url>
  `
		)
		.concat(
			posts.map(
				({ slug }) => `
  <url>
    <loc>${info.url}/blog/${slug}</loc>
  </url>
  `
			)
		)
		.join("")}
</urlset>
`;

export function GET() {
	const headers = {
		"Cache-Control": "max-age=0, s-maxage=3600",
		"Content-Type": "application/xml",
	};

	const posts = getPosts()
		.map((f) => {
			return {
				metadata: getMetadata(f),
				slug: f.slice(0, -3),
			};
		})
		.sort((a, b) => a.metadata.date - b.metadata.date);
	const pages = ["about", "projects"];
	const body = render(pages, posts);

	return new Response(body, { headers });
}
