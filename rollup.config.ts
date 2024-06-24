import process from 'node:process'
import {type Pluggable} from 'unified'
import serve from 'rollup-plugin-serve'
import {type RollupOptions} from 'rollup'
import remarkPrism from 'remark-prism'
import {rollupPluginHTML as html} from '@web/rollup-plugin-html'
import postcss from 'rollup-plugin-postcss'
import typescript from '@rollup/plugin-typescript'
import replace from '@rollup/plugin-replace'
import {nodeResolve} from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import mdx from '@mdx-js/rollup'

function getNodeEnv(): 'production' | 'development' {
	const env = process.env.NODE_ENV ?? 'development'
	if (env !== 'production' && env !== 'development') {
		throw new Error(`Unknown environment ${env}`)
	}

	return env
}

const isDevelopment = getNodeEnv() === 'development'
const isWatching = process.env.ROLLUP_WATCH === 'true'

const watch = {
	include: ['src/**'],
}

const config: RollupOptions[] = [
	{
		input: 'src/index.tsx',
		output: {
			file: 'dist/index.js',
			format: 'module',
			sourcemap: true,
		},
		watch,
		external: ['react', 'react/jsx-runtime', '@react-spring/web'],
		plugins: [
			typescript({
				declaration: true, outDir: 'dist', rootDir: 'src', sourceMap: true,
			}),
		],
	},
	{
		input: 'src/docs/index.html',
		output: {
			dir: 'docs',
			format: 'module',
			sourcemap: true,
		},
		watch,
		plugins: [
			replace({
				// eslint-disable-next-line @typescript-eslint/naming-convention
				'process.env.NODE_ENV': JSON.stringify(getNodeEnv()),
				preventAssignment: true,
			}),
			postcss({extract: true}),
			typescript({sourceMap: true}),
			// https://github.com/sergioramos/remark-prism/issues/304
			mdx({remarkPlugins: [remarkPrism as Pluggable]}),
			nodeResolve(),
			commonjs(),
			html(),
			...(isDevelopment && isWatching) ? [
				serve({
					contentBase: './docs',
					historyApiFallback: true,
				}),
			] : [],
		],
	},
]

export default config
