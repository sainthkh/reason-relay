function decodeErrors(errors) {
  return errors.map(error => {
    return [
      error.locations.map(loc => [loc.line, loc.column]),
      error.message,
      error.path,
    ];
  })
}

exports.decodeErrors = decodeErrors;