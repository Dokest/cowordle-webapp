import adapter from "@sveltejs/adapter-node";
import preprocess from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess({
		postcss: true,
	}),
	kit: {
		adapter: adapter({ out: 'build' }),
		alias: {
			"$components/*": "./src/lib/components/*",
			"$stores/*": "./src/lib/stores/*",
			"$templates/*": "./src/lib/templates/*",
			"$utils/*": "./src/lib/utils/*",
			"$types/*": "./src/types/*",
			"$styles/*": "./src/styles/*",
		},
	},
};

export default config;
