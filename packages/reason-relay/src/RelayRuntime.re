module Network {
  [@bs.deriving abstract]
  type operation = {
    id: option(string),
    name: string,
    operationKind: string,
    text: string,
  };

  type fetchQuery = (operation/*, variables, cacheConfig, uploadables*/) => Js.Promise.t(Js.Json.t);

  [@bs.deriving abstract]
  type t = {
    execute: fetchQuery,
  };

  [@bs.deriving abstract]
  type network = {
    create: fetchQuery => t,
  };

  [@bs.module "relay-runtime"] external network: network = "Network";
  [@bs.send] external create: (network, fetchQuery) => t = "create"

  let create: fetchQuery => t = fetchQuery => {
    network->create(fetchQuery);
  }
};

module RecordSource {
  type t;
  [@bs.new] [@bs.module "relay-runtime"] external make: unit => t = "RecordSource";
}

module Store {
  type t;
  [@bs.new] [@bs.module "relay-runtime"] external make: RecordSource.t => t = "Store";
}

module Environment {
  type t;

  [@bs.deriving abstract] 
  type option = {
    network: Network.t,
    store: Store.t,
  };

  [@bs.new] [@bs.module "relay-runtime"] external make: option => t = "Environment";
}