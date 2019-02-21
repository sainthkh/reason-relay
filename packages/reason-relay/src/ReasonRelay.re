open ReasonRelayTypes;

module MakeQueryRenderer = ReasonRelay__QueryRenderer.MakeQueryRenderer;

[@bs.module "react-relay"] external graphql: string => compiledGraphql = "graphql";
[@bs.module "react-relay"] external createFragmentContainer: (ReasonReact.reactClassInternal, Js.Json.t) => ReasonReact.reactClass = "createFragmentContainer";

let fragmentContainer = (
  component: ReasonReact.componentSpec(
    'state,
    'initialState,
    'retainedProps,
    'initialRetainedProps,
    'action,),
  fragmentSpec: 'spec) 
=> {
  let reactClassInternal = createFragmentContainer(component.reactClassInternal, Obj.magic(fragmentSpec));
  {
    ...component,
    reactClassInternal: Obj.magic(reactClassInternal),
  }
}
