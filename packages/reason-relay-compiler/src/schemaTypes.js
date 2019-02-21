const fs = require('fs-extra');
const path = require('path');
const {parse} = require('graphql');
const {schemaToReason} = require('graphql-to-reason');

exports.makeSchemaTypes = function (schemaPath) {
  let code = fs.readFileSync(schemaPath).toString();
  let ast = parse(code);
  let {reason, codec} = schemaToReason(ast);

  let dir = './src/.relay'
  fs.ensureDirSync(dir);
  fs.writeFileSync(path.join(dir, 'SchemaTypes.re'), reason);
  fs.writeFileSync(path.join(dir, 'SchemaTypes.codec.js'), codec);
}