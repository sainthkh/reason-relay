[@bs.module "react-relay"] external queryRendererClass: ReasonReact.reactClass = "QueryRenderer";

[@bs.deriving abstract]
type renderProps = {
  error: Js.Json.t,
  props: Js.Json.t,
};

[@bs.deriving abstract]
type jsProps = {
  environment: RelayRuntime.Environment.t,
  query: Js.Json.t,
  variables: Js.Json.t,
  render: renderProps => ReasonReact.reactElement
};

let make = (
  ~environment: RelayRuntime.Environment.t,
  ~query: Js.Json.t,
  ~variables: Js.Json.t,
  ~render: renderProps => ReasonReact.reactElement,
  children
) => {
  ReasonReact.wrapJsForReason(
    ~reactClass=queryRendererClass,
    ~props=jsProps(
      ~environment = environment,
      ~query = query,
      ~variables = variables,
      ~render = render
    ),
    children,
  );
};