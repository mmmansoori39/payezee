/* eslint-disable no-undef */
module.exports = {
  env: {
    browser: true,
    jest: true,
    node: true,
    es2021: true
  },
  extends: [
    "eslint:recommended",
    "plugin:react-hooks/recommended",
    "prettier",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime"
  ],
  overrides: [],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: "latest",
    sourceType: "module"
  },
  plugins: ["react"],
  rules: {
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "prefer-const": "error",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react/display-name": "off"
  },
  globals: {
    process: true
  }
};
