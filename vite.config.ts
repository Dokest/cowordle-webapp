import { sveltekit } from '@sveltejs/kit/vite';
import { resolve } from 'path';
import type { UserConfig } from 'vite';


const config: UserConfig = {
	plugins: [sveltekit()],
	resolve: {
		alias: {
			$components: resolve("./src/lib/components/"),
			$stores: resolve("./src/lib/stores/"),
			$templates: resolve("./src/lib/templates/"),
			$utils: resolve("./src/lib/utils/"),
			$types: resolve("./src/types/"),
			$styles: resolve("./src/styles"),
		}
	}
};

export default config;
