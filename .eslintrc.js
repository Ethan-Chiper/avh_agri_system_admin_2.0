module.exports = {
	env: {
		commonjs: true,
		es2021: true,
		node: true
	},
	extends: [
		'eslint:recommended',
		'plugin:node/recommended-script',
		'prettier',
		'plugin:editorconfig/noconflict',
		'plugin:jsdoc/recommended',
		'plugin:json/recommended',
		'plugin:mocha/recommended',
		'plugin:security/recommended',
		'plugin:unicorn/recommended'
	],
	overrides: [],
	parserOptions: {
		ecmaVersion: 'latest'
	},
	rules: {
		'no-console': 'off',
		'no-var': 'off',
		'unicorn/prefer-module':'off',
		'unicorn/filename-case': 'off',
		'unicorn/numeric-separators-style':'off'
	}
};
