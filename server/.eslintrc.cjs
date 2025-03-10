module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  plugins: ["prettier"],
  extends: ["standard", "prettier"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest"
  },
  rules: {}
};
