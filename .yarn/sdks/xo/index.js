import {existsSync} from 'fs'

const relPnpApiPath = '../../../.pnp.cjs'

const { pathname: absPnpApiPath } = new URL(relPnpApiPath, import.meta.url)

if (existsSync(absPnpApiPath)) {
  if (!process.versions.pnp) {
    // Setup the environment to be able to import xo
    const { default: pnp } = await import(absPnpApiPath)
		pnp.setup()
  }
}

// Defer to the real xo your application uses
const xo = await import('xo/index.js')
console.log(xo)
const { getErrorResults, getFormatter, outputFixes, lintText, lintFiles } = xo
export { getErrorResults, getFormatter, outputFixes, lintText, lintFiles }
