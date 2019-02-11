open PluginTypes;

let format = (formatArgs) => {
  let concreteText = formatArgs->concreteTextGet;
  let sourceHash = formatArgs->sourceHashGet;
  {j|
const node = $concreteText;
node.hash = "$sourceHash";
module.exports = node;
  |j}
}