var livememe = require('./provider/livememe')
var makeameme = require('./provider/makeameme')
var memecaptain = require('./provider/memecaptain')
var memegenerator = require('./provider/memegenerator')
var memesdotcom = require('./provider/memesdotcom')

exports.parse = function parse (url) {
  var id

  id = livememe.extractId(url)
  if (id) return { provider: 'livememe', id: id }

  id = makeameme.extractId(url)
  if (id) return { provider: 'makeameme', id: id }

  id = memecaptain.extractId(url)
  if (id) return { provider: 'memecaptain', id: id }

  id = memegenerator.extractId(url)
  if (id) return { provider: 'memegenerator', id: id }

  id = memesdotcom.extractId(url)
  if (id) return { provider: 'memesdotcom', id: id }

  throw new Error('Unknown url')
}

exports.lookup = function lookup (url_or_info, cb) {
  var info

  switch (typeof url_or_info) {
    case 'object': info = url_or_info; break
    case 'string': info = exports.parse(url_or_info); break
    default: throw new TypeError('Expected string or object')
  }

  if (typeof cb !== 'function') {
    throw new TypeError('Expected cb to be a function')
  }

  if (typeof info.id !== 'string') {
    throw new TypeError('Expected id to be a string')
  }

  if (typeof info.provider !== 'string') {
    throw new TypeError('Expected provider to be a string')
  }

  switch (info.provider) {
    case 'livememe': livememe.lookup(info.id, cb); break
    case 'makeameme': makeameme.lookup(info.id, cb); break
    case 'memecaptain': memecaptain.lookup(info.id, cb); break
    case 'memegenerator': memegenerator.lookup(info.id, cb); break
    default: throw new Error('Unknown provider: ' + info.provider)
  }
}
