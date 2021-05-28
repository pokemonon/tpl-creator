module.exports = {
    'env': {
        'node': true,
        'browser': true,
    },
    'parser': '@typescript-eslint/parser',
    'plugins': [
        '@typescript-eslint',
    ],
    'settings': {
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/resolver': {
            'typescript': {
                'alwaysTryTypes': true,
                'project': [
                    'packages/*/tsconfig.json',
                ],
            },
        },
    },
    'extends': [
        'eslint:recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    'rules': {
        // style
        // 'indent': ['error', 4],
        'linebreak-style': ['error', 'unix'],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'comma-dangle': ['error', 'always-multiline' ], // 对象字面量项尾不能有逗号

        '@typescript-eslint/explicit-module-boundary-types': 0,
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/no-empty-function': 0,
        '@typescript-eslint/no-non-null-assertion': 0,

        'import/order': ['error', {
            groups: ['builtin', 'internal', 'external', ['parent', 'sibling', 'index']],
            'newlines-between': 'always',
        }],

        // 兼容问题
        'indent': 0,
        '@typescript-eslint/indent': ['error', 4],
    },
};