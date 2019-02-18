type person = {
  id: string,
  name: string,
};

type queryResponse = {
  i1: option(array(option(person))),
  i2: array(option(person)),
  i3: option(array(person)),
  i4: array(person),
};

[@bs.module "./SchemaTypes"]external decodeQueryResponse: Js.Json.t => queryResponse = "decodeQueryResponse";