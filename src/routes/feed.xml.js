import { escape } from "html-escaper";
import { format } from "date-fns";
import { getPosts } from "$lib/postsReader";
import { process } from "$lib/markdownConverter";
import * as info from "$lib/info";

const copyright = `Copyright © ${new Date().getFullYear()} Tad McCorkle`;

const render = (posts) => `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en-US">
  <link href="${info.url}/feed.xml" rel="self" type="application/atom+xml" />
  <link href="${info.canonical}" rel="alternate" type="text/html" />
  <id>${info.canonical}</id>
  <title>${info.name}'s Blog</title>
  <subtitle>${info.description}</subtitle>
  <updated>${format(new Date(), "yyyy-MM-dd'T'HH:mm:ss")}-05:00</updated>
  <author>
    <name>${info.name}</name>
  </author>
  <rights>${copyright}</rights>
  <generator>SvelteKit</generator>
  ${posts
		.map(
			({ metadata, content, slug }) => `
  <entry>
    <id>${info.url}/blog/${slug}</id>
    <title>${metadata.title}</title>
    <published>${format(new Date(metadata.date), "yyyy-MM-dd")}T00:00:00-05:00</published>
    <updated>${format(
			new Date(metadata.updated || metadata.date),
			"yyyy-MM-dd"
		)}T00:00:00-05:00</updated>
    <link href="${info.url}/blog/${slug}" rel="alternate" type="text/html" title="${
				metadata.title
			}" />
    <author>
      <name>${info.name}</name>
    </author>
    <summary>${metadata.excerpt}</summary>
    <content type="html" xml:base="${info.url}/blog/${slug}">
      ${escape(content)}
    </content>
    <rights>${copyright}</rights>
  </entry>`
		)
		.join("")}
</feed>`;

export async function get() {
	const headers = {
		"Cache-Control": `max-age=0, s-max-age=${600}`,
		"Content-Type": "application/xml",
	};

	const posts = getPosts()
		.map((f) => {
			const { metadata, content } = process(f);
			return {
				metadata,
				content,
				slug: f.slice(0, -3),
			};
		})
		// sorted in reverse chronological order
		.sort((a, b) => b.metadata.date - a.metadata.date);
	const body = render(posts);

	return {
		headers,
		body,
	};
}
