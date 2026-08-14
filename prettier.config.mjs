/** @type {import("prettier").Config} */
const config = {
  // Core formatting
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: "as-needed",

  jsxSingleQuote: false,

  trailingComma: "all",

  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: "always",

  endOfLine: "lf",

  overrides: [
    {
      files: ["*.json", "*.jsonc"],
      options: {
        printWidth: 80,
        tabWidth: 2,
      },
    },
    {
      files: ["*.md"],
      options: {
        printWidth: 80,
        proseWrap: "always",
      },
    },
    {
      files: ["*.css"],
      options: {
        singleQuote: false,
      },
    },
    {
      files: [
        "*.config.ts",
        "*.config.js",
        "vite.config.ts",
        "drizzle.config.ts",
      ],
      options: {
        printWidth: 80,
      },
    },
  ],
};

export default config;
