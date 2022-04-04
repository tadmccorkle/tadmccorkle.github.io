import adapter from "@sveltejs/adapter-static";
import { defineConfig } from "vite";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		vite: defineConfig({
			optimizeDeps: {
				include: ["unified > extend", "unified > is-buffer"],
			},
		}),
	},
};

export default config;
