function configure (values) {
  const fs = require('fs')
  const config = { docRoot: './public' }

  for (const key in values) {
    config[key] = values[key]
  }

  try {
    const stat = fs.statSync(config.docRoot)
    if (!stat.isDirectory()) {
      throw new Error('Is not valid')
    }
  } catch (ex) {
    console.log(`** ${config.docRoot} does not exist or is not a directory!! **`)
    return
  }

  return config
}

module.exports = configure
