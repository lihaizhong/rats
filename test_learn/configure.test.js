const { configure } = require('./configure')

describe('configure tests', function () {
  it('undef if docRoot does not exist', function () {
    expect(configure({ docRoot: '/xxx' })).toThrow()
  })

  it('not undef if docRoot does exist', function () {
    expect(configure({ docRoot: './test_learn/public' })).not.toBeUndefined()
  })

  it('adds values to config hash', function () {
    const config = configure({ docRoot: './test_learn/public', zany: 'crazy' })
    expect(config).not.toBeUndefined()
    expect(config.zany).toBeUndefined()
    expect(config.docRoot).toEqual('./test_learn/public')
  })
})
