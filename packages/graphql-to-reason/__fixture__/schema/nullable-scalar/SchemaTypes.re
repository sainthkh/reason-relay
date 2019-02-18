type queryResponse = {
  id: option(string),
  name: option(string),
  married: option(bool),
  age: option(int),
  closeRate: option(float),
};

[@bs.module "./SchemaTypes"]external decodeQueryResponse: Js.Json.t => queryResponse = "decodeQueryResponse";