const express = require('express');
const graphQLHTTP = require('express-graphql');
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const { buildSchema } = require('graphql')

const config = require('../webpack.config');
const schema = buildSchema(fs.readFileSync(path.join(__dirname, '../data/schema.graphql')).toString())

class Greeting {
  id() {
    return '' + Math.floor((Math.random() * 100000));
  }
  
  message() {
    return 'Hello, GraphQL World!';
  }
}

const root = {
  hello: function() {
    return new Greeting();
  }
}

const APP_PORT = 3000;

// Serve the Relay app
const app = new WebpackDevServer(webpack(config));

// Serve static resources
app.use('/', express.static(path.resolve(__dirname, '../public')));

// Setup GraphQL endpoint
app.use(
  '/graphql',
  graphQLHTTP({
    schema,
    rootValue: root,
    pretty: true,
  }),
);

app.listen(APP_PORT, () => {
  console.log(`App is now running on http://localhost:${APP_PORT}`);
});
