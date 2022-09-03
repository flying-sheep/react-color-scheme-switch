import process from 'node:process'
import {RollupOptions} from 'rollup'
import serve from 'rollup-plugin-serve'
// X import {nodeResolve} from '@rollup/plugin-node-resolve'
import html from '@rollup/plugin-html'
import mdx from '@mdx-js/rollup'
/* X
import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import copy from 'rollup-plugin-copy'
import analyze from 'rollup-plugin-analyzer'
import builtins from 'rollup-plugin-node-builtins'
import postcss from 'rollup-plugin-postcss-modules'
*/
import typescript from '@rollup/plugin-typescript'

function getNodeEnv(): 'production' | 'development' {
	const env = process.env.NODE_ENV ?? 'development'
	if (env !== 'production' && env !== 'development') {
		throw new Error(`Unknown environment ${env}`)
	}

	return env
}

const isDev = getNodeEnv() === 'development'
const isWatching = process.env.ROLLUP_WATCH === 'true'

/* X
async function main() {
	const manifest = await getManifest()
	const compiled = await compile(await fs.readFile('./src/docs/index.mdx'), {remarkPlugins})
	await fs.mkdir('./docs', {recursive: true})
	const entrypoints = {
		react: ['jsx-runtime'],
		'react-dom': ['client'],
	}
	const vars = {
		name: manifest.name,
	}
	await Promise.all([
		fs.cp('./dist', `./docs/${manifest.name}`, {recursive: true}),
		fs.writeFile('./docs/index.js', String(compiled)),
		fs.writeFile('./docs/index.html', await renderHtml('./src/docs/index.html.mustache', entrypoints, vars)),
	])
}
*/

const conf: RollupOptions = {
	input: 'src/docs/index.mdx',
	output: {
		file: 'docs/index.js',
		format: 'module',
		sourcemap: true,
	},
	// Treeshake: {moduleSideEffects: false},
	watch: {
		include: ['src/**'],
	},
	plugins: [
		/* X
		analyze({
			writeTo(formatted) {
				require('fs').writeFile('dist/bundle.log', formatted, (e: Error) => {
					e !== null ? console.error(e) : {}
				})
			},
		}),
		postcss({
			extract: true,
			sourceMap: true,
			writeDefinitions: true,
			plugins: [
				// Autoprefixer(),
			],
		}),
		replace({
			'process.env.NODE_ENV': JSON.stringify(getNodeEnv()),
			'process.env.MUI_SUPPRESS_DEPRECATION_WARNINGS': JSON.stringify(false),
			preventAssignment: true,
		}),
		*/
		typescript(),
		mdx(),
		/* X
		nodeResolve({
			preferBuiltins: true,
			mainFields: ['module', 'main'],
			// 'node_modules/@emotion/unitless/dist/unitless.cjs.dev.js'
		}),
		*/
		/* X
		commonjs(),
		builtins(),
		json(),
		renderdoc({
			include: '*.@(md|rst)',
		}),
    	*/
		html({
			title: 'react-color-scheme',
			fileName: 'index.html',
			meta: [
				{charset: 'utf8'},
				{name: 'color-scheme', content: 'dark light'},
				{name: 'viewport', content: 'minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no'},
			],
			publicPath: '/',
		}),
		/* X
		copy({
			targets: [
				{src: 'lighttpd.conf', dest: 'dist'},
				{src: 'static', dest: 'dist'},
			],
		}),
    	*/
		...(isDev && isWatching) ? [
			serve({
				contentBase: './docs',
				historyApiFallback: true,
			}),
		] : [],
	],
}

export default conf
