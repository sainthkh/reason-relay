
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
  if(!type.inList) {
    typeList.push(type);
    type.inList = true;
  }
  return typeList;
}

function isScalar(type) {
  let scalarTypes = ["ID", "String", "Int", "Float", "Boolean"];
  return scalarTypes.includes(type);
}

function generateReasonCode(typeList) {
  let typeCode = typeList.map(type => {
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

  return `
${typeCode}

[@bs.module "./SchemaTypes"]external decodeQueryResponse: Js.Json.t => queryResponse = "decodeQueryResponse";
`.trim();
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

// Added comment for sections because template string literals break 
// the code indentation. And it makes code hard to read. 
function generateCodec(typeList) {
  let exportedNames = [];
  let arrayTypes = new Set();

  // Functions
  let functions = typeList.map(type => {
    let name = handleSpecialTypeNames(type.name);
    let functionName = `decode${name}`;
    exportedNames.push(functionName);
    
    return `
var ${functionName} = function (res) {
  return [
${type.fields.map(field => {
  let varname = `res.${field.name}`;

  if(isScalar(field.type)) {
    return `    ${varname},`;
  } else {
    let decoderName = field.array
      ? `decode${field.type}Array`
      : `decode${field.type}`;
    
    if (field.array) {
      arrayTypes.add(field.type);
    }

    return field.option
      ? `    ${varname} ? ${decoderName}(${varname}) : undefined,`
      : `    ${decoderName}(${varname}),`;
  }
}).join('\n')}
  ]
}`.trim();
  }).join('\n\n');

  // Array Decoders
  let arrayDecoders = Array.from(arrayTypes).map(type => {
    exportedNames.push(`decode${type}Array`);
    return `
var decode${type}Array = function (arr) {
  return arr.map(item =>
    item ? decode${type}(item) : undefined
  )
}
`.trim()
  }
).join('\n\n')

  // exports part.
  let exported = exportedNames.map(name => 
    `exports.${name} = ${name};`
  ).join('\n').trim();

  return `
${functions}
${arrayDecoders ? `\n${arrayDecoders}\n` : ''}
${exported}
`.trim();
}

function handleSpecialTypeNames(name) {
  let names = {
    "Query": "QueryResponse",
    "Mutation": "MutationResponse",
    "Subscription": "SubscriptionResponse",
  };

  let typeName = names[name];
  return typeName ? typeName : name;
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