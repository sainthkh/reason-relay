const fs = require('fs-extra');
const path = require('path');
const {queryToReason} = require('graphql-to-reason');

function generate(node) {
  const dir = './src/.relay';

  let code = queryToReason(node)
  fs.ensureDirSync(dir);
  fs.writeFileSync(path.join(dir, `${node.name}.re`), code);

  return ''; // We cannot add ReasonML types to js files. So, return empty string. 
}

module.exports = {
  generate,
  transforms: require('relay-compiler/lib/RelayFlowGenerator').transforms,
}