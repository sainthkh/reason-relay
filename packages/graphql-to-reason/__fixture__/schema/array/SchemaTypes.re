type person = {
  id: string,
  name: string,
};

type queryResponse = {
  i1: option(array(option(int))),
  i2: array(option(int)),
  i3: option(array(int)),
  i4: array(int),
  p1: option(array(option(person))),
  p2: array(option(person)),
  p3: option(array(person)),
  p4: array(person),
};

[@bs.module "./SchemaTypes"]external decodeQueryResponse: Js.Json.t => queryResponse = "decodeQueryResponse";