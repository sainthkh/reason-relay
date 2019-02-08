open RelayRuntime;

let fetchQuery: Network.fetchQuery = operation => {
  let payload = Js.Dict.empty();
  payload->Js.Dict.set("query", Js.Json.string(operation->Network.textGet));

  open Fetch;
  Js.Promise.(
    fetchWithInit(
      "/graphql",
      RequestInit.make(
        ~method_=Post, 
        ~headers=HeadersInit.make({
          "Content-Type": "application/json"
        }),
        ~body=BodyInit.make(Js.Json.stringify(Js.Json.object_(payload))),
        ()
      ),
    )
    |> then_(Response.json)
    |> then_(json => {
      let result = Js.Json.decodeObject(json)
        ->Belt.Option.mapWithDefault(Js.Dict.empty(), d => d);

      switch(result->Js.Dict.get("errors")) {
      | Some(errors) => Js.log(errors)
      | None => ()
      }
      resolve(json)
    })
  );
}

let network = Network.create(fetchQuery);
let recordSource = RecordSource.make();
let store = Store.make(recordSource);
let environment = Environment.make(
  Environment.option(~network=network, ~store=store));