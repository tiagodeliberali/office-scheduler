const { off } = require("process");

module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  rules: {
    "no-non-null-assertion": off,
    "no-explicit-any": off,
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "prettier",
  ],
};
