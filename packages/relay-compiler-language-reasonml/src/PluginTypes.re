[@bs.deriving abstract]
type sourceLocation = {
  line: int,
  column: int,
};

[@bs.deriving abstract]
type graphQLTag = {
  keyName: Js.Nullable.t(string),
  template: string,
  sourceLocationOffset: sourceLocation,
};

type graphQLTagFinder = (string, string) => array(graphQLTag);

[@bs.deriving abstract]
type typeGeneratorObj = {
  generate: unit => string,
};

type formatModuleFunc = unit => string;

[@bs.deriving abstract]
type relayCompilerPlugin = {
  inputExtensions: array(string),
  outputExtension: string,
  findGraphQLTags: graphQLTagFinder,
  typeGenerator: typeGeneratorObj,
  formatModule: formatModuleFunc,
};