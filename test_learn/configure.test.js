const configure = require('./configure')

describe('configure tests', function () {
  it('undef if docRoot does not exist', function () {
    expect(configure({ docRoot: '/xxx' })).toBeUndefined()
  })

  it('not undef if docRoot does exist', function () {
    expect(configure({ docRoot: './test_learn/public' })).not.toBeUndefined()
  })

  it('adds values to config hash', function () {
    const config = configure({ docRoot: './test_learn/public', zany: 'crazy' })
    expect(config).not.toBeUndefined()
    expect(config.zany).toEqual('crazy')
    expect(config.docRoot).toEqual('./test_learn/public')
  })

  it('verifies value1 good ...', function () {})

  it('verifies value1 bad ...', function () {})
})
