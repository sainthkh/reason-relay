const {find} = require('../src/tagFinder');

describe('Find GraphQL tags', () => {
  it("parses simple file", () => {
    expect(find("let a = 3.141592; ")).toEqual([]);
  })

  let queryRenderer = `
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
  `.trim();

  it("parses query in QueryRenderer", () => {
    expect(find(queryRenderer)[0].template.trim()).toBe(`
    query AppQuery {
      hello {
        message
      }
    }
    `.trim())
  })

  it("returns correct line and column number", () => {
    let {line, column} = find(queryRenderer)[0].sourceLocationOffset;
    expect([line, column]).toEqual([3, 9]);
  })

  it.skip("parses multiple queries in a single file", () => {

  })

  it.skip("proper keyNames are returned with fragment container", () => {

  })
})