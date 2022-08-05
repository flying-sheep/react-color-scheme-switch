import {promises as fs} from 'node:fs'
import {compile} from 'xdm'

void main()

async function main() {
	const compiled = await compile(await fs.readFile('./src/index.mdx'))
	await fs.mkdir('./docs')
	await fs.writeFile('./docs/index.js', String(compiled))
}
