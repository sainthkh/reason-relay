const fs = require('fs');
const path = require('path');

const {parse} = require('graphql');
const {getDirectories} = require('../test-util');
const fixtures = getDirectories(path.join(__dirname, '../__fixture__/schema'));

const {schemaToReason} = require('../src/generator');

describe(`schema tests`, () => {
  fixtures.forEach(fixture => {
    let schemaPath = path.join(fixture, 'schema.graphql');
    let schema = parse(fs.readFileSync(schemaPath, 'utf8'));

    let result = schemaToReason(schema);
    let reason = fs.readFileSync(path.join(fixture, 'SchemaTypes.re')).toString();
    let codec = fs.readFileSync(path.join(fixture, 'SchemaTypes.codec.js')).toString();

    test(`${path.basename(fixture)} reason code`, () => {
      expect(result.reason).toBe(reason);
    })

    test.skip(`${path.basename(fixture)} codec code`, () => {
      expect(result.codec).toBe(codec);
    })
  })
})