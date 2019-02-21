module.exports = () => {
  return {
    inputExtensions: ["re"],
    outputExtension: "js",
    findGraphQLTags: require('./tagFinder').find,
    typeGenerator: {
      generate: () => "",
      transforms: [],
    },
    formatModule: require('./format').format,
  }
}