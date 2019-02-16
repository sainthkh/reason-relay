const fs = require('fs');
const path = require('path');

const {buildASTSchema, parse, extendSchema} = require('graphql');
const {transformASTSchema} = require('relay-compiler/lib/ASTConvert');
const RelayMatchTransform = require('relay-compiler/lib/RelayMatchTransform');
const RelayRelayDirectiveTransform = require('relay-compiler/lib/RelayRelayDirectiveTransform');
const GraphQLCompilerContext = require('relay-compiler/lib/GraphQLCompilerContext');
const RelayFlowGenerator = require('relay-compiler/lib/RelayFlowGenerator');
const {Parser, convertASTDocuments} = require('relay-compiler')

const {
  queryToReason,
} = require('../src/generator')

const {getDirectories} = require('../test-util');
const fixtures = getDirectories(path.join(__dirname, '../__fixture__/clientQuery'));

describe(`client query tests`, () => {
  fixtures.forEach(fixture => {
    // The code below is based on the relay-compiler tests. 
    // Check relay-compiler/language/javascript/__tests__/RelayFlowGenerator-test.js

    // generate typed graphql ast
    let schemaPath = path.join(fixture, 'schema.graphql');
    let testSchema = buildASTSchema(
      parse(fs.readFileSync(schemaPath, 'utf8'), {assumeValid: true}),
    );
    let schema = transformASTSchema(testSchema, [
      RelayMatchTransform.SCHEMA_EXTENSION,
      RelayRelayDirectiveTransform.SCHEMA_EXTENSION,
    ]);

    let codePath = path.join(fixture, 'code.graphql');
    let ast = parse(fs.readFileSync(codePath).toString());
    const extendedSchema = extendSchema(schema, ast, {assumeValid: true});
    const definitions = convertASTDocuments(
      extendedSchema,
      [ast],
      [],
      Parser.transform.bind(Parser),
    );

    let results = new GraphQLCompilerContext(testSchema, schema)
      .addAll(definitions)
      .applyTransforms(RelayFlowGenerator.transforms)
      .documents()
      .map(node => {
        return queryToReason(node);
      });

    let reason = fs.readFileSync(path.join(fixture, 'types.re')).toString();
    
    test.skip(`${path.basename(fixture)} test`, () => {
      expect(results[0]).toBe(reason);
    })
  })
})