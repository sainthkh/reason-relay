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