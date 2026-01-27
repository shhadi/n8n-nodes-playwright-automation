import { config } from '@n8n/node-cli/eslint';
import { configWithoutCloudSupport } from '@n8n/node-cli/eslint';

const enableCloudSupport = false;
const n8nLintConfiguration = enableCloudSupport ? config: configWithoutCloudSupport;

import security from 'eslint-plugin-security';
import unusedImports from 'eslint-plugin-unused-imports';
import importPlugin from 'eslint-plugin-import';
import tsEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
    ...n8nLintConfiguration,
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: './tsconfig.lint.json',
                tsconfigRootDir: import.meta.dirname,
            }
        },
        plugins: {
            "security": security,
            "unused-imports": unusedImports,
            "import": importPlugin,
            "@typescript-eslint": tsEslint,
        },
        settings: {
            "import/resolver": {
                "node": {
                    "extensions": [".js", ".jsx", ".ts", ".tsx"]
                },
                "typescript": {
                    "alwaysTryTypes": true,
                    "project": "./tsconfig.lint.json"
                }
            }
        },
        rules: {
            "@typescript-eslint/no-redundant-type-constituents": "error",
            "no-restricted-syntax": [
                "error",
                {
                    "selector": "Literal[value=null]",
                    "message": "Avoid using 'null'. Prefer 'undefined' or optional chaining instead."
                }
            ],
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "unused-imports/no-unused-imports": "error",
            "unused-imports/no-unused-vars": [
                "warn",
                {
                    "vars": "all",
                    "varsIgnorePattern": "^_",
                    "args": "after-used",
                    "argsIgnorePattern": "^_"
                }
            ],
            "@typescript-eslint/explicit-function-return-type": [
                "error",
                { "allowExpressions": false, "allowTypedFunctionExpressions": false }
            ],
            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/no-floating-promises": "error",
            "@typescript-eslint/strict-boolean-expressions": "error",
            "@typescript-eslint/no-misused-promises": "error",
            "@typescript-eslint/no-inferrable-types": "error",
            "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
            "@typescript-eslint/no-unnecessary-type-assertion": "error",


            "@typescript-eslint/naming-convention": [
                "error",
                {
                    "selector": "variable",
                    "format": ["camelCase", "UPPER_CASE"],
                    "leadingUnderscore": "allow"
                },
                { "selector": "function", "format": ["camelCase"] },
                { "selector": "typeLike", "format": ["PascalCase"] }
            ],
            "@typescript-eslint/consistent-type-imports": [
                "error",
                { "prefer": "type-imports", "disallowTypeAnnotations": false }
            ],
            "@typescript-eslint/array-type": ["error", { "default": "array-simple" }],
            "@typescript-eslint/switch-exhaustiveness-check": "error",
            "@typescript-eslint/no-empty-function": "error",
            "@typescript-eslint/no-magic-numbers": [
                "error",
                {
                    "ignore": [0, 1, -1],
                    "ignoreEnums": true,
                    "ignoreNumericLiteralTypes": true,
                    "ignoreReadonlyClassProperties": true
                }
            ],
            "@typescript-eslint/promise-function-async": "error",
            "linebreak-style": ["error", "unix"],
            "@typescript-eslint/member-ordering": [
                "error",
                {
                    "default": [
                        "public-static-field",
                        "protected-static-field",
                        "private-static-field",
                        "public-instance-field",
                        "protected-instance-field",
                        "private-instance-field",
                        "constructor",
                        "public-static-method",
                        "protected-static-method",
                        "private-static-method",
                        "public-instance-method",
                        "protected-instance-method",
                        "private-instance-method"
                    ]
                }
            ],
            "@typescript-eslint/prefer-optional-chain": "error",
            "no-console": "error",
            "no-debugger": "error",
            "prefer-const": "error",
            "no-var": "error",
            "no-duplicate-imports": "error",
            "no-new-require": "error",
            "curly": "error",
            "eqeqeq": ["error", "always"],
            "no-shadow": "error",
            "default-case": "error",
            "consistent-return": "error",
            "no-warning-comments": [
                "warn",
                { "terms": ["todo", "fixme"], "location": "anywhere" }
            ],
            "prefer-template": "error",
            "import/order": [
                "error",
                {
                    "newlines-between": "always",
                    "alphabetize": { "order": "asc", "caseInsensitive": true }
                }
            ],
            "import/no-unresolved": "error",
            "import/no-duplicates": "error",
            "import/no-extraneous-dependencies": "error",
            "import/no-mutable-exports": "error",
            "import/newline-after-import": ["error", { "count": 1 }],
            "no-implicit-coercion": ["error", { "allow": ["!!"] }],
            "prefer-object-spread": "error",
            "security/detect-object-injection": "error",
            "security/detect-non-literal-fs-filename": "error",
            "security/detect-eval-with-expression": "error",
            "security/detect-pseudoRandomBytes": "error",
            "security/detect-child-process": "error"
        }
    },
    {
        files: ["test/**/*.ts"],
        rules: {
            "security/detect-non-literal-fs-filename": "off",
            "@typescript-eslint/explicit-function-return-type": "off"
        }
    }
];
