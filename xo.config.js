import xoReact from 'eslint-config-xo-react'
// eslint-plugin-react doesn’t support ESLint 10 natively yet
import {fixupConfigRules} from '@eslint/compat'

export default [
	{ignores: ['.yarn/**']},
	...fixupConfigRules(xoReact()),
	{
		semicolon: false,
		rules: {
			'react/require-default-props': 'off',
			'import-x/order': ['error', {alphabetize: {order: 'desc'}}],
			'@html-eslint/no-inline-styles': 'off',
		},
	},
]
