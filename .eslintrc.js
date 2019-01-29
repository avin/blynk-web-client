module.exports = {
    parser: 'babel-eslint',
    extends: [
        'airbnb-base',
        'react-app',
        'plugin:import/errors',
        'prettier',
        'plugin:react/recommended',
    ],
    env: {
        jest: true,
    },
    plugins: ['import', 'react'],
    rules: {
        indent: ['error', 4, { SwitchCase: 1 }],
        'max-len': ['error', 120],
        'no-bitwise': 'off',
        'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
        'no-mixed-operators': 'off',
        'no-await-in-loop': 'off',
        'func-names': ['error', 'never'],
        'no-underscore-dangle': 'off',
        'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
        'prefer-destructuring': [
            'error',
            {
                VariableDeclarator: {
                    array: false,
                    object: true,
                },
                AssignmentExpression: {
                    array: true,
                    object: false,
                },
            },
            {
                enforceForRenamedProperties: false,
            },
        ],
        'import/prefer-default-export': 'off',
        'import/no-named-as-default': 'off',
        'import/no-extraneous-dependencies': [
            'error',
            { devDependencies: ['**/*.test.js', '**/*.spec.js', '**/test/*.js', '**/__tests__/*.js'] },
        ],
        'no-param-reassign': 'off',
        'class-methods-use-this': 'off',
        'no-shadow': 'off',
        'consistent-return': 'off',
        'spaced-comment': ['error', 'always'],
        'react/prop-types': 'off',
    },
    settings: {
        react: {
            version: require('react/package.json').version,
        },
    },
};
