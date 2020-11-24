module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es6: true,
    },
    extends: ['eslint:recommended', 'plugin:vue/essential'],
    globals: {
        chrome: 'readonly',
        browser: 'readonly',
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
        ecmaVersion: 2018,
    },
    plugins: ['vue'],
    rules: {},
}