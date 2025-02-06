export default [
  {
    ignores: ["node_modules/", "dist/", ".next/"],
  },
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
    },
    extends: ["next/core-web-vitals"],
  },
];

