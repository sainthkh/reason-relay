const fs = require('fs');
const path = require('path');
const {execFile} = require('child_process');
const argv = require('yargs').argv;
const {makeSchemaTypes} = require('./schemaTypes');

const src = argv.src ? argv.src : "./src";
const schemaPath = argv.schema;

if(!schemaPath) {
  console.log("schema path is required.");
  process.exit();
}

makeSchemaTypes(schemaPath);

let filtered = ['--language', '--src']
let args = []
for(let i = 2; i < process.argv.length; i++) {
  let arg = process.argv[i];
  if (filtered.includes(arg)) {
    i++;
    continue;
  } else {
    args.push(arg);
  }
}

args.push('--src');
args.push(src);
args.push('--language');
args.push('reasonml');

// Loop up the directory tree until we find the relay-compiler. 
try {
  let modulePath = 'node_modules/relay-compiler/bin/relay-compiler';
  let moduleFullPath = path.join(process.cwd(), modulePath);
  let lastPath = '';
  let parentDir = '';

  while(true) {
    if(fs.existsSync(moduleFullPath)) {
      args.unshift(moduleFullPath);
      break;
    } 

    lastPath = moduleFullPath;
    parentDir += '../';
    moduleFullPath = path.join(process.cwd(), parentDir, modulePath);
    console.log(moduleFullPath);

    if(lastPath == moduleFullPath) {
      throw new Error();
    }
  }
}
catch(e) {
  console.log(e);
  console.log("relay-compiler is not installed.");
  process.exit();
}

execFile('node', args, (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
})
