const fs = require('fs');
const path = require('path');

const isDirectory = source => fs.statSync(source).isDirectory()
const getDirectories = source =>
  fs.readdirSync(source)
  .map(name => path.join(source, name))
  .filter(isDirectory)

module.exports = {
  getDirectories,
}