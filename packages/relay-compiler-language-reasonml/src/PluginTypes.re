[@bs.deriving abstract]
type sourceLocation = {
  line: int,
  column: int,
};

[@bs.deriving abstract]
type graphQLTag = {
  keyName: string,
  template: string,
  sourceLocationOffset: sourceLocation,
};

type graphQLTagFinder = (string) => array(graphQLTag);

[@bs.deriving abstract] 
type iTransform;

[@bs.deriving abstract]
type node;

[@bs.deriving abstract]
type typeGeneratorObj = {
  generate: node => string,
  transforms: array(iTransform),
};

[@bs.deriving abstract]
type formatArgs = {
  concreteText: string,
  sourceHash: string,
};

type formatModuleFunc = formatArgs => string;

[@bs.deriving abstract]
type relayCompilerPlugin = {
  inputExtensions: array(string),
  outputExtension: string,
  findGraphQLTags: graphQLTagFinder,
  typeGenerator: typeGeneratorObj,
  formatModule: formatModuleFunc,
};