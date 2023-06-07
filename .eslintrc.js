module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 6,
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "no-console": 1,
    "import/first": "error",
    "react/prop-types": 0,
    "linebreak-style": 0
  },
}