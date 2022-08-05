import {promises as fs} from 'node:fs'
import {compile} from 'xdm'

void main()

async function main() {
	const compiled = await compile(await fs.readFile('./src/docs/index.mdx'))
	await fs.mkdir('./dist/docs', {recursive: true})
	await Promise.all([
		fs.writeFile('./dist/docs/index.js', String(compiled)),
		fs.copyFile('./src/docs/index.html', './dist/docs/index.html'),
	])
}
