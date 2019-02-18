var decodePerson = function (res) {
  return [
    res.id,
    res.name,
  ]
}

var decodeQueryResponse = function (res) {
  return [
    res.i1,
    res.i2,
    res.i3,
    res.i4,
    res.p1 ? decodePersonArray(res.p1) : undefined,
    decodePersonArray(res.p2),
    res.p3 ? decodePersonArray(res.p3) : undefined,
    decodePersonArray(res.p4),
  ]
}

var decodePersonArray = function (arr) {
  return arr.map(item =>
    item ? decodePerson(item) : undefined
  )
}

exports.decodePerson = decodePerson;
exports.decodeQueryResponse = decodeQueryResponse;
exports.decodePersonArray = decodePersonArray;