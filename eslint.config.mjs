import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Limits logic in components, not markup: the whole `return (<JSX />)` is one
  // statement, while hooks, consts, ifs and handlers each count. When it warns,
  // move logic into a hook (see "Components" in AGENTS.md).
  {
    files: ["src/**/*.tsx"],
    rules: {
      "max-statements": ["warn", 10],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
