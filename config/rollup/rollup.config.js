
import json from 'rollup-plugin-json';
import {terser} from 'rollup-plugin-terser';
import resolves from 'rollup-plugin-node-resolve' // 依赖引用插件
import commonjs from '@rollup/plugin-commonjs';
import image from '@rollup/plugin-image';
import ts from 'rollup-plugin-typescript2'
const alias = require('@rollup/plugin-alias');
const babel = require('@rollup/plugin-babel').default;
const getBabelConfig = require('../getBabelConfig');
import postcss from 'rollup-plugin-postcss'
const {
  join,resolve
} = require('path');
let pkg = {};
try {
  pkg = require(join(process.cwd(), 'package.json'));
} catch (e) {}

const extensions = ['.js', '.jsx', '.ts', '.tsx'];
// ts
const tsPlugin = ts({
  tsconfig: join(process.cwd(), 'tsconfig.json'),  // 导入本地ts配置
  extensions
})

const babelOpts = {
  ...getBabelConfig('esm',false),
  babelHelpers: 'bundled',
  babelrc: false,
  extensions,
  exclude: /\/node_modules\//,
}

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),

];

const terserOpts = {
  compress: {
    pure_getters: true,
    unsafe: true,
    unsafe_comps: true,
    warnings: false,
  },
};
export default [{
  input:[join(process.cwd(), './src/index.tsx')], 
  plugins:[
    json(),
    resolves(extensions),
    alias({
      entries: { '@': resolve('./src') },
    }),
    image(),
     postcss({
      extensions: ['.css', '.less'],
      extract: true,
      inject: true,
      modules: false,
      autoModules: false,
      minimize: true,
      use: ['less'],
      plugins: [
       
      ],
    }),
    commonjs(),
    tsPlugin,
    babel(babelOpts),
  ],
  output:[{
    format:'esm',
    file: join(process.cwd(), 'es/index.js'),
  }],
  context: 'window',
  external
},
{
  input:[join(process.cwd(), './src/index.tsx')], 
  plugins:[
    json(),
    resolves(extensions),
    alias({
      entries: { '@': resolve('./src') },
    }),
    image(),
    postcss({
      extensions: ['.css', '.less'],
      extract: true,
      inject: true,
      modules: false,
      autoModules: false,
      minimize: true,
      use: ['less'],
      plugins: [
       
      ],
    }),
    commonjs(),
    tsPlugin,
    babel(babelOpts),
    terser(terserOpts)
  ],
  
  output:[{
    format:'umd',
    file: join(process.cwd(), 'dist/index.js'),
    sourcemap: false,
    name: 'npmdemo',
    globals:{
      react:'React'
    }
  }],
  context: 'window',
  external
}
];