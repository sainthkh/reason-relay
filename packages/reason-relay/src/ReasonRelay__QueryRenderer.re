type graphqlError = {
  message: string,
};

let decodeErrors: Js.Json.t => array(graphqlError) = errors => {
  [||]
}

module type QuerySpec = {
  type variablesType;
  type schemaQueryResponse;
  let decodeResponse: Js.Json.t => schemaQueryResponse;
};

module MakeQueryRenderer = (Query: QuerySpec) => {
  [@bs.module "react-relay"] external queryRendererClass: ReasonReact.reactClass = "QueryRenderer";

  type queryResult = 
  | Loading
  | Error(array(graphqlError))
  | Data(Query.schemaQueryResponse)
  ;

  [@bs.deriving abstract]
  type renderProps = {
    error: Js.Nullable.t(Js.Json.t),
    props: Js.Nullable.t(Js.Json.t),
  };

  [@bs.deriving abstract]
  type jsProps = {
    environment: RelayRuntime.Environment.t,
    query: ReasonRelayTypes.compiledGraphql,
    variables: Query.variablesType,
    render: renderProps => ReasonReact.reactElement
  };

  let make = (
    ~environment: RelayRuntime.Environment.t,
    ~query: ReasonRelayTypes.compiledGraphql,
    ~variables: Query.variablesType,
    ~render: queryResult => ReasonReact.reactElement,
    children
  ) => {
    ReasonReact.wrapJsForReason(
      ~reactClass=queryRendererClass,
      ~props=jsProps(
        ~environment = environment,
        ~query = query,
        ~variables = variables,
        ~render = (renderProps:renderProps) => {
          let props = renderProps->propsGet->Js.Nullable.toOption;
          let errors = renderProps->errorGet->Js.Nullable.toOption;
          let result = switch(props, errors) {
          | (Some(props), _) => Data(Query.decodeResponse(props))
          | (_, Some(errors)) => Error(decodeErrors(errors))
          | (None, None) => Loading
          }

          render(result)
        }
      ),
      children,
    );
  };
}