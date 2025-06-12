import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";

export default [
    js.configs.recommended,
    {
        files: ["**/*.ts"],
        ignores: ["**/*.config.ts"],
        languageOptions: {
            parser: tsParser,
            globals: {
                process: "readonly",
                console: "readonly",
            },
            env: {
                node: true,
                es2021: true,
            }
        },
        plugins: {
            "@typescript-eslint": ts,
            "prettier": prettier,
        },
        rules: {
            "indent": ["error", 2],
            "quotes": ["error", "double"],
            "semi": ["error", "always"],
            "linebreak-style": ["error", "unix"],
            "no-unused-vars": "off",
            "eqeqeq": ["error", "always"],
            "max-len": ["error", { code: 100 }],
            "prettier/prettier": [
                "error",
                {
                    singleQuote: false,
                    semi: true,
                    tabWidth: 2,
                    trailingComma: "es5",
                    printWidth: 100,
                    endOfLine: "lf"
                },
            ],
        },
    },
];