import { sveltekit } from '@sveltejs/kit/vite';
import { resolve } from 'path';
import type { UserConfig } from 'vite';


const config: UserConfig = {
	plugins: [sveltekit()],
	resolve: {
		alias: {
			$lib: resolve(__dirname, "./src/lib/"),
			$components: resolve(__dirname, "./src/lib/components/"),
			$stores: resolve(__dirname, "./src/lib/stores/"),
			$templates: resolve(__dirname, "./src/lib/templates/"),
			$utils: resolve(__dirname, "./src/lib/utils/"),
			$types: resolve(__dirname, "./src/types/"),
			$styles: resolve(__dirname, "./src/styles"),
		}
	}
};

export default config;
