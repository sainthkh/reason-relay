type queryResponse = {
  id: string,
  name: string,
  married: bool,
  age: int,
  closeRate: float,
};

[@bs.module "./SchemaTypes"]external decodeQueryResponse: Js.Json.t => queryResponse = "decodeQueryResponse";