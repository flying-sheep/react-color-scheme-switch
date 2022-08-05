const { rules } = require('eslint-config-xo-typescript')

const NC = '@typescript-eslint/naming-convention'

const nameRules = rules[NC].map((r) => {
  if (typeof r === 'string') return r
  const { selector, format, ...rest } = r
  if (!selector.includes('variable') || !selector.includes('function')) return r
  return { selector, format: ['strictCamelCase', 'StrictPascalCase'], ...rest }
})

module.exports = {
  semicolon: false,
  extends: [
    'xo-react',
    'plugin:react/jsx-runtime',
  ],
  rules: {
    [NC]: nameRules,
  }
}
