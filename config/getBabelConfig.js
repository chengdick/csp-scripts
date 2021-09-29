module.exports = (moduleType, useHMR) => ({
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage", // 按需加载
        corejs: 3 // corejs 替代了以前的pollyfill
      }
    ],
    "@babel/preset-react",
    "@babel/preset-typescript"
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/plugin-proposal-export-default-from',
    ['@babel/plugin-proposal-private-methods',{ loose: true }],
    [
      "@babel/plugin-proposal-object-rest-spread",
      { loose: true, useBuiltIns: true }
    ],
  ].filter(Boolean),
});
