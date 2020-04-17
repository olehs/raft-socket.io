module.exports = {
    "env": {
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": ["eslint:recommended", "plugin:prettier/recommended"],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "plugins": ["prettier"],
    "rules": {
        "prettier/prettier": ["warn"],
        "no-unused-vars": ["warn", { "vars": "all", "args": "none"}]
    }
};