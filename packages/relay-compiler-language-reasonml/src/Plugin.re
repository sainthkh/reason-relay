open PluginTypes;

let exports = relayCompilerPlugin(
  ~inputExtensions=[|".re"|],
  ~outputExtension=".re",
  ~findGraphQLTags=GraphQLTagFinder.find,
  ~typeGenerator=typeGeneratorObj(
    ~generate=() => "",
  ),
  ~formatModule=() => "",
);
