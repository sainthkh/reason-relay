const {
  generateTypeCode,
  commentOnTop,
  childTypes,
  isScalar,
} = require('./util')

function generateTypeListFromQuery(ast) {
  //console.log(require('ast-pretty-print')(ast));

  let types = {};
  extractType(types, ast, []);

  let typeList = childTypes(types, types["Query"]);
  return typeList;
}

function extractType(types, ast, selectionNames) {
  let fields = ast.selections.map(selection => {
    if(selection.kind == "LinkedField") {
      extractType(types, selection, [...selectionNames, selection.name]);
    }

    let {option, typeName, array, contentOption} = interpretType(selection.type)
    return {
      name: selection.name,
      type: isScalar(typeName)
        ? typeName
        : [...selectionNames, selection.name, typeName].join('_'),
      option,
      array, 
      contentOption,
    }
  })
  
  let {typeName} = interpretType(ast.type);
  let name = [...selectionNames, typeName].join('_');
  types[name] = {
    name,
    fields,
  }
}

function argumentTypes(args) {
  let fields = args.map(arg => {
    let {option, typeName, array, contentOption} = interpretType(arg.type)
    return {
      name: arg.name,
      type: typeName,
      option,
      array,
      contentOption,
    }
  })

  if (fields.length > 0) {
    let types = [];
    types.push({
      name: 'variablesType',
      fields,
    });
    types.push({
      name: 'queryVars',
      fields,
    });

    return types;
  } else {
    return [];
  }
}

function interpretType(type) {
  let typeName = '' + type;
  let option = typeName[typeName.length - 1] != '!';
  let array = typeName[0] == '[';
  let contentOption = array
    ? typeName[typeName.length - (option? 2:3)] != '!'
    : false;
  let name = typeName.match(/\[?([A-Za-z0-9_]+)!?\]?!?/)[1];
  return {
    option,
    typeName: name,
    array,
    contentOption,
  }
}

function generateReasonCode(typeList, args) {
  return `
${commentOnTop()}

${generateTypeCode(typeList)}

${generateVariablesEncoder(args)}

type schemaQueryResponse = SchemaTypes.queryResponse;
let decodeResponse = SchemaTypes.decodeQueryResponse;
`.trim();
}

function generateVariablesEncoder(args) {
  if(args.length > 0) {
    return `
[@bs.deriving abstract]
${generateTypeCode(args)}

let encodeVariables: queryVars => variablesType = (vars) => variablesType(${generateVaraiblesArgs(args[0].fields)});
`.trim();
  } else {
    return `
type variablesType = Js.Dict.t(Js.Json.t);
let encodeVariables: unit => variablesType = () => Js.Dict.empty();
`.trim();
  }
}

function generateVaraiblesArgs(fields) {
  return fields.map(field => `~${field.name}=vars.${field.name}`).join(',')
}

exports.queryToReason = function(ast) {
  let typeList = generateTypeListFromQuery(ast);
  let args = argumentTypes(ast.argumentDefinitions);
  return generateReasonCode(typeList, args);
}