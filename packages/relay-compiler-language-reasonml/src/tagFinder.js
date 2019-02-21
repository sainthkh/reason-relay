const lineColumn = require('line-column');

function find(text) {
  let re = /graphql\({\|([\s\S]*)\|}\)/g;

  let tags = [];
  let result;
  while ((result = re.exec(text)) !== null) {
    let {line, col: column} = lineColumn(text, result.index);
    tags.push({
      keyName: null,
      template: result[1],
      sourceLocationOffset: {
        line,
        column,
      }
    })
  }

  return tags;
}

exports.find = find;