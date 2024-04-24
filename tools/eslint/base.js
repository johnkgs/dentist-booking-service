/// <reference types="./types.d.ts" />

import eslint from "@eslint/js"
import importPlugin from "eslint-plugin-import"
import tsEslint from "typescript-eslint"

export default tsEslint.config(
  {
    // Globally ignored files
    ignores: ["**/*.config.js"]
  },
  {
    files: ["**/*.js", "**/*.ts", "**/*.tsx"],
    plugins: {
      import: importPlugin
    },
    extends: [
      eslint.configs.recommended,
      ...tsEslint.configs.recommended,
      ...tsEslint.configs.recommendedTypeChecked,
      ...tsEslint.configs.stylisticTypeChecked
    ],
    rules: {
      "no-console": ["error"],
      "prefer-const": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "turbo/no-undeclared-env-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_"
        }
      ],
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "separate-type-imports" }
      ],
      "@typescript-eslint/no-misused-promises": [
        2,
        { checksVoidReturn: { attributes: false } }
      ],
      "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
      "@typescript-eslint/no-unnecessary-condition": [
        "error",
        {
          allowConstantLoopConditions: true
        }
      ],
      "@typescript-eslint/no-non-null-assertion": "error"
    }
  },
  {
    linterOptions: { reportUnusedDisableDirectives: true },
    languageOptions: { parserOptions: { project: true } }
  }
)
