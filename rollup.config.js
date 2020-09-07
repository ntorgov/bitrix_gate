import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import json from 'rollup-plugin-json';

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/main.ts',
	output: {
		file: 'dst/main.js',
		format: 'cjs', // immediately-invoked function expression — suitable for <script> tags
		sourcemap: true
	},
	plugins: [
		commonjs(),
		resolve(),
		json(),
		production && terser() // minify, but only in production
	]
};