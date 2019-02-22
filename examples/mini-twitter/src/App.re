open ReasonRelay;
open AppQuery;

let component = ReasonReact.statelessComponent("App")

module QueryRenderer = ReasonRelay.MakeQueryRenderer(AppQuery);
let make = (_children) => {
  ...component,

  render: _self => {
    <QueryRenderer
      environment = Env.environment
      query=graphql({|
        query AppQuery {
          hello {
            message
          }
        }
      |})
      variables=encodeVariables()
      render = {(result) => {
        switch(result) {
        | Loading => { ReasonReact.string("Loading...") }
        | Error(messages) => { ReasonReact.string("Error...") }
        | Data(response) => { 
          switch(response.hello) {
          | None => ReasonReact.string("No message") 
          | Some(hello) => ReasonReact.string(hello.message) 
          }
        }
        }
      }}
    />
  }
}
