import process from 'node:process'
import serve from 'rollup-plugin-serve'
import {RollupOptions} from 'rollup'
import typescript from '@rollup/plugin-typescript'
import replace from '@rollup/plugin-replace'
import {nodeResolve} from '@rollup/plugin-node-resolve'
import html, {makeHtmlAttributes, RollupHtmlOptions, RollupHtmlTemplateOptions} from '@rollup/plugin-html'
import commonjs from '@rollup/plugin-commonjs'
import mdx from '@mdx-js/rollup'

function getNodeEnv(): 'production' | 'development' {
	const env = process.env.NODE_ENV ?? 'development'
	if (env !== 'production' && env !== 'development') {
		throw new Error(`Unknown environment ${env}`)
	}

	return env
}

const isDev = getNodeEnv() === 'development'
const isWatching = process.env.ROLLUP_WATCH === 'true'

const staticLinks = [
	'https://cdn.jsdelivr.net/npm/@exampledev/new.css@1/new.min.css',
	'https://esm.sh/prism-themes@1.9.0/themes/prism-synthwave84.css',
]

const template = ({attributes, files: {js = [], css = []}, meta, publicPath, title}: RollupHtmlTemplateOptions) => {
	const scripts = js.map(({fileName}) => `<script src="${publicPath}${fileName}"${makeHtmlAttributes(attributes.script)}></script>`)
	const links = [
		...staticLinks,
		...css.map(({fileName}) => `${publicPath}${fileName}`),
	].map(l => `<link href="${l}" rel="stylesheet"${makeHtmlAttributes(attributes.link)}>`)
	const metas = meta.map(input => `<meta${makeHtmlAttributes(input)}>`)
	return `\
<!doctype html>
<html${makeHtmlAttributes(attributes.html)}>
<head>
	${metas.join('\n')}
	<title>${title}</title>
	${links.join('\n')}
	${scripts.join('\n')}
</head>
<body>
	<main></main>
</body>
</html>`
}

const watch = {
	include: ['src/**'],
}

const conf: RollupOptions[] = [
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
			typescript(),
		],
	},
	{
		input: 'src/docs/index.tsx',
		output: {
			file: 'docs/index.js',
			format: 'module',
			sourcemap: true,
		},
		watch,
		plugins: [
			replace({
				// eslint-disable-next-line @typescript-eslint/naming-convention
				'process.env.NODE_ENV': JSON.stringify(getNodeEnv()),
				// eslint-disable-next-line @typescript-eslint/naming-convention
				'process.env.MUI_SUPPRESS_DEPRECATION_WARNINGS': JSON.stringify(false),
				preventAssignment: true,
			}),
			typescript(),
			mdx(),
			nodeResolve(),
			commonjs(),
			html({
				title: 'react-color-scheme',
				fileName: 'index.html',
				meta: [
					{charset: 'utf8'},
					{name: 'color-scheme', content: 'dark light'},
					{name: 'viewport', content: 'minimum-scale=1, initial-scale=1, width=device-width'},
				],
				publicPath: '/',
				template: template as RollupHtmlOptions['template'], // See https://github.com/rollup/plugins/pull/1254
			}),
			...(isDev && isWatching) ? [
				serve({
					contentBase: './docs',
					historyApiFallback: true,
				}),
			] : [],
		],
	},
]

export default conf
