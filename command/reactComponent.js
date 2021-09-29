// const runCmd = require('../utils/runCmd');
const program = require('commander');
const path = require('path');
const rollupPath = path.join(__dirname, '../config/rollup/');
const webpackPath = path.join(__dirname, '../config/webpack/');
//局部模式
const shell = require('shelljs');
program
  .command('react-component <name>')
  .description('react 组件项目')
  .action(async (name, ops) => {
    const scripts = {
      dev:`webpack-dev-server --config ${webpackPath}webpack.config.js`,
      build: `rollup -c ${rollupPath}rollup.config.js`
    };

    const cmdStr = scripts[name];
    if (shell.exec(`${cmdStr}`).code !== 0) {
      shell.echo('Error: 执行报错了');
      shell.exit(1);
    }
  });
