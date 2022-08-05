import {promises as fs} from 'node:fs'
import {compile} from 'xdm'

void main()

async function main() {
	const compiled = await compile(await fs.readFile('./src/index.mdx'))
	console.log(String(compiled))
}
