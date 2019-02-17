
function generateTypeListFromSchema(ast) {
  // Create type map
  let types = {}
  ast.definitions.forEach(definition => {
    let kind = definition.kind;
    if (kind == "ObjectTypeDefinition") {
      let name = definition.name.value;
      let fields = definition.fields.map(field => {
        switch(field.type.kind) {
        case "NamedType": 
          return {
            name: field.name.value,
            type: field.type.name.value,
            option: true,
          }
        case "NonNullType": 
          if(field.type.type.kind != "ListType") {
            return {
              name: field.name.value,
              type: field.type.type.name.value,
              option: false,
            }
          } else {
            let nullable = field.type.type.type.kind == "NamedType";
            return {
              name: field.name.value, 
              type: nullable
                ? field.type.type.type.name.value
                : field.type.type.type.type.name.value,
              option: false,
              array: true,
              contentOption: nullable,
            }
          }
        case "ListType":
          let nullableType = field.type.type.kind == "NamedType";
          return {
            name: field.name.value,
            type: nullableType
              ? field.type.type.name.value
              : field.type.type.type.name.value,
            option: true,
            array: true,
            contentOption: nullableType,
          }
        }
      })

      types[name] = {
        name,
        fields,
      }
    }
  });

  let typeList = childTypes(types, types["Query"]);
  return typeList;
}

function generateTypeListFromQuery(ast) {
  return [];
}

function childTypes(types, type) {
  let typeList = []
  type.fields.reverse().forEach(field => {
    if(!isScalar(field.type)){
      typeList = childTypes(types, types[field.type]).concat(typeList);
    }
  });
  type.fields.reverse();
  typeList.push(type);
  return typeList;
}

function isScalar(type) {
  let scalarTypes = ["ID", "String", "Int", "Float", "Boolean"];
  return scalarTypes.includes(type);
}

function generateReasonCode(typeList) {
  return typeList.map(type => {
    let name = lowerTheFirstCharacter(type.name);
    name = handleRootNames(name);
    return `
type ${name} = {
${
  type.fields.map(field => {
    return `  ${field.name}: ${decodeTypeName(field)},`
  }).join('\n')
}
};
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

function decodeTypeName(field) {
  let typeNames = {
    "ID": "string",
    "String": "string",
    "Boolean": "bool",
    "Int": "int",
    "Float": "float",
  };

  let typeName = typeNames[field.type];
  typeName = typeName ? typeName : lowerTheFirstCharacter(field.type);
  typeName = field.contentOption
    ? `option(${typeName})`
    : typeName;
  
  typeName = field.array
    ? `array(${typeName})`
    : typeName;

  return field.option? `option(${typeName})` : typeName;
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