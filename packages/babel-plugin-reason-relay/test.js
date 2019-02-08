const reasonRelay = require('./src/index');
const pluginTester = require('babel-plugin-tester');

pluginTester({
  plugin: reasonRelay,
  pluginName: 'reason relay',
  tests: [
    {
      code: `
var ReactRelay = require("react-relay");
var query = ReactRelay.graphql("\\n        query AppQuery {\\n          hello {\\n            message\\n          }\\n        }\\n      ");`,
      output: `
var ReactRelay = require("react-relay");
var query = require("./__generated__/AppQuery.graphql");`,
    }
  ]
})
