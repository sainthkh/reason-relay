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
  if(typeName[typeName.length - 1] == '!') {
    if(typeName[0] == '[') {
      let contentOption = typeName[typeName.length - 3] != '!';
      return {
        option: false,
        typeName: typeName.substring(
          1, 
          typeName.length - (contentOption ? 2 : 3)
        ),
        array: true,
        contentOption,
      }
    } else {
      // Type!
      return {
        option: false,
        typeName: typeName.substring(0, typeName.length - 1),
      }
    }
  } else {
    if(typeName[0] == '[') {
      let contentOption = typeName[typeName.length - 2] != '!';
      return {
        option: true,
        typeName: typeName.substring(
          1, 
          typeName.length - (contentOption ? 1 : 2)
        ),
        array: true,
        contentOption,
      }
    } else {
      return {
        option: true,
        typeName,
      }
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