
function generateTypeListFromSchema(ast) {
  // Create type map
  let types = {}
  ast.definitions.forEach(definition => {
    let kind = definition.kind;
    if (kind == "ObjectTypeDefinition") {
      let name = definition.name.value;
      let fields = definition.fields.map(field => {
        return {
          name: field.name.value, 
          type: field.type.type.name.value,
        }
      })

      types[name] = {
        name,
        fields,
      }
    }
  });

  let typeList = [];
  Object.keys(types).forEach(name => {
    typeList.push(types[name]);
  })

  return typeList;
}

function generateTypeListFromQuery(ast) {
  return [];
}

function generateReasonCode(typeList) {
  return typeList.map(type => {
    let name = lowerTheFirstCharacter(type.name);
    name = handleRootNames(name);
    return `
type ${name} = {
${
  type.fields.map(field => {
    return `  ${field.name}: ${decodeTypeName(field.type)},`
  }).join('\n')
}
}
`.trim();
  }).join('\n\n');
}

function handleRootNames(name) {
  let rootNames = {
    "query": "queryResponse",
    "mutation": "mutationResponse",
    "subscription": "subscriptionResponse",
  };

  let rootName = rootNames[name];

  return rootName ? rootName : name;
}

function decodeTypeName(name) {
  let typeNames = {
    "ID": "string",
    "String": "string",
    "Boolean": "bool",
    "Int": "int",
    "Float": "float",
  };

  let typeName = typeNames[name];

  return typeName ? typeName : lowerTheFirstCharacter(name);
}

function lowerTheFirstCharacter(name) {
  return name[0].toLowerCase() + name.substring(1);
}

function generateCodec(typeList) {
  return "codec";
}

exports.schemaToReason = function(ast) {
  let typeList = generateTypeListFromSchema(ast);
  return {
    reason: generateReasonCode(typeList),
    codec: generateCodec(typeList),
  };
}

exports.queryToReason = function(ast) {
  let typeList = generateTypeListFromQuery(ast);
  return generateReasonCode(typeList);
}