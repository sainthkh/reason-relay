open PluginTypes;
open Jest;

let find = GraphQLTagFinder.find;

describe("FingGraphQLTags", () => {
  open Expect;

  test("parse simple file", () => {
    expect(find("let a = 3.141592; ")) |> toEqual([||])
  });

let queryRenderer = {j|
<QueryRenderer
  environment = Env.environment
  query=graphql({|
    query AppQuery {
      hello {
        message
      }
    }
  |})
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
    |j} -> Js.String.trim

  test("parse query in QueryRenderer", () => {
    expect(find(queryRenderer)[0]->templateGet) 
      |> toBe({|
    query AppQuery {
      hello {
        message
      }
    }
  |});
  })

  test("return correct line and column", () => {
    let loc = find(queryRenderer)[0]->sourceLocationOffsetGet;
    let line = loc->lineGet;
    let column = loc->columnGet;

    expect([|line, column|]) |> toEqual([|3, 9|])
  })


});