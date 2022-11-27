module.exports = {
	root: true,

	env: {
		node: true,
	},
	extends: ["plugin:vue/essential", "@vue/prettier"],
	rules: {
		"no-console": "off",
		"no-debugger": "off",
		"no-unused-vars": 1,
		"no-extra-semi": 0,
		"comma-dangle": "off",
		"vue/max-attributes-per-line": "off",
		"no-useless-return": "off",
		"no-empty-pattern": "off",
	},
	parserOptions: {
		parser: "babel-eslint",
	},
};
