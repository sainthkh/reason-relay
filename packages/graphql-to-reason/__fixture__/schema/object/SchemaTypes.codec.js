exports.decodeB = function (res) {
  return [
    res.id,
    res.iii,
  ]
}

exports.decodeA = function (res) {
  return [
    res.id,
    res.ii,
    decodeB(res.b),
    res.ff,
  ]
}

exports.decodeC = function (res) {
  return [
    res.id,
    res.ss,
  ]
}

exports.decodeQueryResponse = function (res) {
  return [
    res.i,
    res.a ? decodeA(res.a) : undefined,
    res.s,
    decodeC(res.c),
  ]
}