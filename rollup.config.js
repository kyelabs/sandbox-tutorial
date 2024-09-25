import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import contentLoader from './content-loader';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import copy from 'rollup-plugin-copy';
import webWorkerLoader from 'rollup-plugin-web-worker-loader';
import { string } from 'rollup-plugin-string';

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/main.js',
	output: {
		file: 'dist/bundle.js',
		format: 'iife', // immediately-invoked function expression — suitable for <script> tags
		sourcemap: true
	},
	plugins: [
		resolve(),
    postcss(),
		commonjs(), // converts date-fns to ES modules
    contentLoader(),
		string({ include: '**/*.py' }),
		webWorkerLoader({}),
		copy({ targets: [
			{ src: 'assets/*', dest: 'dist' },
		]}),
		// production && terser() // minify, but only in production
    !production && serve({
      // open: true,
      contentBase: ['dist'],
    }),
    !production && livereload({ watch: ['dist'] })
	]
};
