module.exports = function (context) {
  const t = context.types;

  const visitor = {
    CallExpression(path, state) {
      let callee = path.node.callee;
      if (callee.type == "MemberExpression") {
        let {object, property} = callee;

        if (object.name == "ReactRelay" && property.name == "graphql") {
          let str = path.node.arguments[0].value;

          let nameRegex = /^\s*(?:query|mutation|fragment)\s+([A-Za-z0-9_]+)\s+{/;
          let name = str.match(nameRegex)[1];

          path.replaceWith(
            t.callExpression(
              t.identifier("require"),
              [t.stringLiteral(`./__generated__/${name}.graphql`)]
            )
          )
        }
      }
    }
  }

  return {
    visitor: {
      Program(path, state) {
        path.traverse(visitor, state)
      }
    }
  }
}