open PluginTypes;

let exports = relayCompilerPlugin(
  ~inputExtensions=[|".re"|],
  ~outputExtension=".re",
  ~findGraphQLTags=GraphQLTagFinder.finder,
  ~typeGenerator=typeGeneratorObj(
    ~generate=() => "",
  ),
  ~formatModule=() => "",
);
