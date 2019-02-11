open PluginTypes;

let default = () => relayCompilerPlugin(
  ~inputExtensions=[|"re"|],
  ~outputExtension="js",
  ~findGraphQLTags=GraphQLTagFinder.find,
  ~typeGenerator=typeGeneratorObj(
    ~generate=(node) => {
      ""
    },
    ~transforms= [||],
  ),
  ~formatModule=FormatModule.format,
);
