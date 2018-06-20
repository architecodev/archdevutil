const shell = require('shelljs');
const outs = require('./outs');

outs().forEach(each => shell.rm('-rf', each));
