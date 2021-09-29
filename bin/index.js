#!/usr/bin/env node
const path = require('path');
const program = require('commander');
const fse = require('fs-extra');

// 加载所有命令行
fse.readdir(path.resolve(__dirname, '../', './command')).then((files) => {
  files.filter(item => /.+\.js$/.test(item))
    .forEach((file) => {
      require(`../command/${file.trim()}`);
    });
  if (process.argv.length <= 2) {
    return  program.help();
  }
  program.parse(process.argv);
}).catch((err) => {
  console.log(err)
});
