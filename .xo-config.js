/** @type {import('eslint').Linter.Config} */
export default {
  semicolon: false,
  extends: [
    'xo-react',
    'plugin:react/jsx-runtime',
  ],
  rules: {
    'react/require-default-props': 'off',
    'import/order': ['error', {alphabetize: {order:'desc'}}]
  }
}
