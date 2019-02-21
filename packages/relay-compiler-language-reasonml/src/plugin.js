module.exports = () => {
  return {
    inputExtensions: ["re"],
    outputExtension: "js",
    findGraphQLTags: require('./tagFinder').find,
    typeGenerator: require('./typeGenerator'),
    formatModule: require('./format').format,
  }
}