import React from 'react';
import {QueryRenderer, graphql} from 'react-relay';

import {Environment, Network, RecordSource, Store} from 'relay-runtime';

function fetchQuery(operation, variables) {
  return fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  }).then(response => {
    return response.json(); 
  });
}

const modernEnvironment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
});

export default class App extends React.Component {
  render() {
    return <QueryRenderer
      environment={modernEnvironment}
      query={graphql`
        query AppQuery {
          hello{message}
        }
      `}
      variables={{}}
      render={({error, props}) => {
        console.log(props)
        if (props) {
          return <div>{props.hello.message}</div>;
        } else {
          return <div>Loading</div>;
        }
      }}
    />
  }
}