module.exports = {
	'env': {
		'browser': true, 'es2021': true
	},
	'extends': [`eslint:recommended`, `plugin:@typescript-eslint/recommended`, `plugin:react/recommended`],
	'overrides': [{
		'env': {
			'node': true
		}, 'files': [`.eslintrc.{js,cjs}`], 'parserOptions': {
			'sourceType': `script`
		}
	}],
	"settings": {
		"react": {
			"version": `detect`
		}
	},
	'parser': `@typescript-eslint/parser`,
	'parserOptions': {
		'ecmaVersion': `latest`, 'sourceType': `module`
	},
	'plugins': [`@typescript-eslint`,`react-refresh`, `react`, `react-hooks`],
	'rules': {
		'indent': [`error`, `tab`],
		'linebreak-style': [`error`, `unix`],
		'quotes': [`error`, `backtick`],
		'semi': [`error`, `never`],
		'@typescript-eslint/no-explicit-any': `off`,
		'react/react-in-jsx-scope': `off`,
		'@typescript-eslint/ban-ts-comment': `off`,
		'react/prop-types': `off`, //TODO checar necessidade
		'react-hooks/exhaustive-deps':`warn`,
		'no-mixed-spaces-and-tabs': `off`,
		'@typescript-eslint/no-namespace': `off`,
		'@typescript-eslint/no-unused-vars': `warn`,
		'react-refresh/only-export-components': `warn`,
		'react/display-name': `off`, //TODO checar necessidade

	}
}
