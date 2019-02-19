const {
  generateTypeCode,
  commentOnTop,
  childTypes,
} = require('./util')

function generateTypeListFromQuery(ast) {
  //console.log(require('ast-pretty-print')(ast));

  let types = {};
  let fields = ast.selections.map(selection => {
    let {option, typeName} = interpretType(selection.type)
    return {
      name: selection.name,
      type: typeName,
      option,
    }
  })

  types['' + ast.type] = {
    name: '' + ast.type,
    fields,
  }

  let typeList = childTypes(types, types["Query"]);
  return typeList;
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