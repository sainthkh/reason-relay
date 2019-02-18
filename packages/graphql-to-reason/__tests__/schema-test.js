const fs = require('fs');
const path = require('path');

const {parse} = require('graphql');
const {getDirectories} = require('../test-util');
const fixtures = getDirectories(path.join(__dirname, '../__fixture__/schema'));

const {schemaToReason} = require('../src/generator');

describe(`schema tests`, () => {
  fixtures.forEach(fixture => {
    let tests = ['non-nullable-scalar', 'nullable-scalar', 'object'];
    if(!tests.includes(path.basename(fixture))) return;

    let schemaPath = path.join(fixture, 'schema.graphql');
    let schema = parse(fs.readFileSync(schemaPath, 'utf8'));

    let result = schemaToReason(schema);
    let reason = fs.readFileSync(path.join(fixture, 'SchemaTypes.re')).toString();
    let codec = fs.readFileSync(path.join(fixture, 'SchemaTypes.codec.js')).toString();

    let normalizeNewline = code =>
      code
        .replace(/\r\n/g, '\n') 
        .replace(/\r/g, '\n');

    test(`${path.basename(fixture)} reason code`, () => {
      let expected = normalizeNewline(result.reason);
      let received = normalizeNewline(reason);
      expect(expected).toBe(received);
    })

    test(`${path.basename(fixture)} codec code`, () => {
      let expected = normalizeNewline(result.codec);
      let received = normalizeNewline(codec);
      expect(expected).toBe(received);
    })
  })
})