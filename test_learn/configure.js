function validateDocRoot (docRoot) {
  const fs = require('fs')
  const stat = fs.statSync(docRoot)

  if (!stat.isDirectory()) {
    throw new Error('Is not valid!')
  }
}

const schemas = {
  docRoot: {
    validator: validateDocRoot,
    default: './test_learn/public'
  }
}

exports.configure = function (values) {
  const config = {}

  for (const key in schemas) {
    if (typeof values[key] === 'undefined') {
      config[key] = schemas[key].default
    } else {
      config[key] = values[key]

      if (typeof schemas[key].validator === 'function') {
        schemas[key].validator(values[key])
      }
    }
  }

  return config
}
