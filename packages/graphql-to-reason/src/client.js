const {
  generateTypeCode,
  commentOnTop,
  childTypes,
} = require('./util')

function generateTypeListFromQuery(ast) {
  //console.log(require('ast-pretty-print')(ast));

  let types = {};
  extractType(types, ast);

  let typeList = childTypes(types, types["Query"]);
  return typeList;
}

function extractType(types, ast) {
  let fields = ast.selections.map(selection => {
    if(selection.kind == "LinkedField") {
      extractType(types, selection);
    }
    let {option, typeName} = interpretType(selection.type)
    return {
      name: selection.name,
      type: typeName,
      option,
    }
  })
  
  let name = ast.type.name ? ast.type.name : ast.type.ofType.name;
  types[name] = {
    name,
    fields,
  }
}

function interpretType(type) {
  let typeName = '' + type;
  if(typeName[typeName.length - 1] == '!') {
    return {
      option: false,
      typeName: typeName.substring(0, typeName.length - 1),
    }
  } else {
    return {
      option: true,
      typeName,
    }
  }
}

function generateReasonCode(typeList) {
  return `
${commentOnTop()}

${generateTypeCode(typeList)}
`.trim();
}

exports.queryToReason = function(ast) {
  let typeList = generateTypeListFromQuery(ast);
  return generateReasonCode(typeList);
}