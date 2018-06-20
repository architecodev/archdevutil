const { lstatSync, readdirSync } = require('fs');
const { join } = require('path');

const src = 'src';
const isDirectory = source => lstatSync(source.path).isDirectory();
const resolveComponents = () => readdirSync(src)
  .map(name => ({ name, path: join(src, name) }))
  .filter(isDirectory)
  .map(source => (source.name));

  module.exports = () => ([
  'index.js',
  'index.d.ts',
  ...resolveComponents()
]);
