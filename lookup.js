var livememe = require('./provider/livememe')
var makeameme = require('./provider/makeameme')
var memecaptain = require('./provider/memecaptain')
var memegenerator = require('./provider/memegenerator')

function lookup (uri, cb) {
  var id

  id = livememe.extractId(uri)
  if (id) return livememe.lookup(id, cb)

  id = makeameme.extractId(uri)
  if (id) return makeameme.lookup(id, cb)

  id = memecaptain.extractId(uri)
  if (id) return memecaptain.lookup(id, cb)

  id = memegenerator.extractId(uri)
  if (id) return memegenerator.lookup(id, cb)

  setImmediate(cb, null, null)
}

module.exports = exports = lookup
