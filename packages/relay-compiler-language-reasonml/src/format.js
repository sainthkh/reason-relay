function format(args) {
  return `
const node = ${args.concreteText};
node.hash = "${args.sourceHash}";
module.exports = node;
`
}

exports.format = format;