
function generateTypeListFromSchema(ast) {
  return ast;
}

function generateTypeListFromQuery(ast) {
  return ast;
}

function generateReasonCode(typeList) {
  return "reason";
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