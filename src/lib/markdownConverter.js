import { h } from "hastscript";
import { readSync } from "to-vfile";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkDirective from "remark-directive";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import yaml from "js-yaml";

function customDirectives() {
	return (tree) => {
		visit(tree, (node) => {
			if (
				node.type === "textDirective" ||
				node.type === "leafDirective" ||
				node.type === "containerDirective"
			) {
				const data = node.data || (node.data = {});
				const hast = h(node.name, node.attributes);
				data.hName = hast.tagName;
				data.hProperties = hast.properties;
			}
		});
	};
}

const frontmatterParser = unified().use(remarkParse).use(remarkFrontmatter);

const processor = frontmatterParser
	.use(remarkMath)
	.use(remarkGfm)
	.use(remarkDirective)
	.use(customDirectives)
	.use(remarkRehype, { allowDangerousHtml: true })
	.use(rehypeSlug)
	.use(rehypeAutolinkHeadings)
	.use(rehypeKatex)
	.use(rehypeHighlight)
	.use(rehypeStringify, { allowDangerousHtml: true });

export function getMetadata(file) {
	const tree = frontmatterParser.parse(readSync(file));
	if (!(tree.children.length > 0) || tree.children[0].type != "yaml") {
		throw Error(`Post in ${file} is missing yaml metadata.`);
	}

	const metadata = yaml.load(tree.children[0].value);
	metadata.date?.setUTCHours(12, 0, 0, 0);
	metadata.updated?.setUTCHours(12, 0, 0, 0);

	return metadata;
}

export function process(file) {
	const metadata = getMetadata(file);
	const content = String(processor.processSync(readSync(file)));

	return { metadata, content };
}
