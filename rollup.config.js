import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import contentLoader from './content-loader';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import copy from 'rollup-plugin-copy';

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
		resolve(), // tells Rollup how to find date-fns in node_modules
    postcss(),
		commonjs(), // converts date-fns to ES modules
    contentLoader(),
		copy({ targets: [{ src: 'src/python/*', dest: 'dist' }] }),
		// production && terser() // minify, but only in production
    !production && serve({
      // open: true,
      openPage: '/01-basics/01-introduction.html',
      contentBase: ['dist'],
    }),
    !production && livereload({ watch: 'dist' })
	]
};
