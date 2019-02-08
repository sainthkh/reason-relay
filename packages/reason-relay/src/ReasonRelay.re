open ReasonRelayTypes;

module QueryRenderer = ReasonRelay__QueryRenderer;

[@bs.module "react-relay"] external graphql: string => compiledGraphql = "graphql"
