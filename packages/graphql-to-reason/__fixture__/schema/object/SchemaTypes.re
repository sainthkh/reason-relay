type b = {
  id: string,
  iii: option(int),
};

type a = {
  id: string,
  ii: option(int),
  b: b,
  ff: float,
};

type c = {
  id: string,
  ss: option(string),
};

type queryResponse = {
  i: int,
  a: option(a),
  s: option(string),
  c: c,
};