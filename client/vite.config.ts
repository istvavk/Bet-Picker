import {sveltekit} from '@sveltejs/kit/vite';
import {defineConfig} from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
		exclude: ['7z-wasm']
	},
	resolve: {
		alias: {
			path: 'rollup-plugin-node-polyfills/polyfills/path'
		}
	}
});
