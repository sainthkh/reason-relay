open ReasonRelay;

let query = [%raw {| require("./__generated__/AppQuery.graphql") |}];

let component = ReasonReact.statelessComponent("App")

let make = (_children) => {
  ...component,

  render: _self => {
    <QueryRenderer
      environment = Env.environment
      query
      variables = Js.Json.object_(Js.Dict.empty())
      render = {(renderProps) => {
        let props = renderProps->QueryRenderer.propsGet;
        let dict = Js.Json.decodeObject(props)
        switch(dict) {
        | None => { ReasonReact.string("Loading...") }
        | Some(dict) => {
          let hello = dict->Js.Dict.unsafeGet("hello");
          let helloDict = hello->Js.Json.decodeObject
            ->Belt.Option.mapWithDefault(Js.Dict.empty(), d => d);
          let message = helloDict->Js.Dict.unsafeGet("message")
            ->Js.Json.decodeString
            ->Belt.Option.mapWithDefault("", s => s);

          ReasonReact.string(message)
        }
        }
      }}
    />
  }
}
