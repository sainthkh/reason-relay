const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');

// relay-compiler and relay-compiler-language-reasonml(rclr below) should be in the same folder. 
// But lerna bootstrap deletes rclr folder whenever we run lerna bootstrap. 
// That's why we're generating symlink after bootstrap. 
var opsys = process.platform;
if (opsys == "win32" || opsys == "win64") {
  // To use symlink function in windows we need admin privilege. 
  // So, we're calling cmd command mklink. 
  execFile('cmd', ['/C', 'mklink', '/J', 
    '.\\node_modules\\relay-compiler-language-reasonml',
    '.\\packages\\relay-compiler-language-reasonml', ]
  );
} else {
  fs.symlinkSync(
    './node_modules/relay-compiler-language-reasonml',
    './packages/relay-compiler-language-reasonml',
    'dir');
}

// Don't know why but lerna only copies the path to the command file. 
// Because of that, execution fails. 
// So, we're forcefully copying executable command file to the example projects.
const isDirectory = source => fs.statSync(source).isDirectory()
const getDirectories = source =>
  fs.readdirSync(source)
  .map(name => path.join(source, name))
  .filter(isDirectory)

getDirectories('./examples').forEach(dir => {
  fs.copyFileSync('./scripts/reason-relay-compiler', path.join(dir, 'node_modules/.bin', 'reason-relay-compiler'));
  fs.copyFileSync('./scripts/reason-relay-compiler.cmd', path.join(dir, 'node_modules/.bin', 'reason-relay-compiler.cmd'));
})