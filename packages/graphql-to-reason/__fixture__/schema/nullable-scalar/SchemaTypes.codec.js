exports.decodeQueryResponse = function (res) {
  return [
    res.id,
    res.name,
    res.married,
    res.age,
    res.closeRate,
  ]
}