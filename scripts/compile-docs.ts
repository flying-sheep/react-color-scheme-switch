import {promises as fs} from 'node:fs'
import {compile} from 'xdm'
import {buildDepTree, LockfileType, PkgTree} from 'snyk-nodejs-lockfile-parser'
import {IPackageJson} from 'package-json-type'
import mustache from 'mustache'

let manifest: IPackageJson & {name: string} | undefined
let lockfile: PkgTree | undefined

void main()

async function getManifest(): Promise<IPackageJson & {name: string}> {
	if (!manifest) {
		const f = await fs.readFile('./package.json', {encoding: 'utf8'})
		manifest = JSON.parse(f) as IPackageJson & {name: string}
		if (!manifest.name) {
			throw new Error('No name in package.json')
		}
	}

	return manifest
}

async function getLockfile(): Promise<PkgTree> {
	if (!lockfile) {
		const manifestContents = JSON.stringify(await getManifest())
		const lockFileContents = await fs.readFile('./yarn.lock', {encoding: 'utf8'})
		lockfile = await buildDepTree(manifestContents, lockFileContents, true, LockfileType.yarn2)
	}

	return lockfile
}

async function importMapUrl(dep: string): Promise<string> {
	const lockfile = await getLockfile()
	const parts = dep.split('/')
	const pkgLength = dep.startsWith('@') ? 2 : 1
	const [pkg, path] = [parts.slice(0, pkgLength).join('/'), parts.slice(pkgLength).join('/')]
	if (!(pkg in lockfile.dependencies)) {
		throw new Error(`Package ${pkg} not found in ${Object.keys(lockfile).join(', ')}`)
	}

	const ver = lockfile.dependencies[pkg].version!
	return `https://esm.sh/${pkg}@${ver}${path.length > 0 ? `/${path}` : ''}?dev`
}

async function getImportMap(entrypoints: Record<string, string[]> = {}): Promise<Record<string, string>> {
	const {name} = await getManifest()
	const {dependencies} = await getLockfile()

	const importMap = Object.fromEntries(
		await Promise.all(
			Object.entries(dependencies)
				.flatMap(([dep, spec]) => {
					if (spec.labels?.scope === 'dev' && !(dep in entrypoints)) {
						return []
					}

					return ([
						[dep, importMapUrl(dep)] as const,
						...(entrypoints[dep] ?? []).map(ep => ([`${dep}/${ep}`, importMapUrl(`${dep}/${ep}`)] as const)),
					])
				})
				.map(async ([k, vp]) => ([k, await vp] as const)),
		),
	)

	return {
		...importMap,
		[name]: `./${name}/index.js`,
	}
}

async function renderHtml(
	templatePath: string,
	entrypoints: Record<string, string[]> = {},
	vars: Record<string, any> = {},
) {
	const imports = await getImportMap(entrypoints)
	const view = {imports: JSON.stringify(imports, undefined, 2), ...vars}
	return mustache.render(await fs.readFile(templatePath, {encoding: 'utf8'}), view)
}

async function main() {
	const manifest = await getManifest()
	const compiled = await compile(await fs.readFile('./src/docs/index.mdx'))
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
