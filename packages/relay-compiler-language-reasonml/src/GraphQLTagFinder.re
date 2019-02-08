open PluginTypes;

[@bs.deriving abstract]
type codePoint = {
  line: int,
  col: int,
};

[@bs.module] external lineColumn: (string, int) => codePoint = "line-column";


let find: graphQLTagFinder = text => {
  let re = [%raw "/graphql\({\|([\s\S]*)\|}\)/g"]
  
  switch(re |> Js.Re.exec(text)) {
  | None => [||]
  | Some(result) => {
    let point = lineColumn(text, Js.Re.index(result));
    [|graphQLTag(
      ~keyName="data",
      ~template=Js.Re.captures(result)[1]
        ->Js.toOption
        ->Belt.Option.mapWithDefault("", s => s),
      ~sourceLocationOffset=sourceLocation(
        ~line=point->lineGet,
        ~column=point->colGet,
      )
    )|]
  }
  }
}