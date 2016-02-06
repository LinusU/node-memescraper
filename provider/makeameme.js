var get = require('simple-get')
var cheerio = require('cheerio')
var Entities = require('html-entities').AllHtmlEntities

var htmlEntities = new Entities()

var nameMap = {
  '[10] Guy': 'stoner-stanley',
  'Actual Advice Mallard': 'actual-advice-mallard',
  'Annoyed Picard': 'annoyed-picard',
  'Confession Bear': 'confession-bear',
  'First World Problems': 'first-world-problems',
  'Foul Bachelor Frog': 'foul-bachelor-frog',
  'I Guarantee it - George Zimmer': 'i-guarantee-it',
  'Insanity Wolf': 'insanity-wolf',
  'Matrix Morpheus': 'matrix-morpheus',
  'Scumbag Stacy': 'scumbag-stacy',
  'Success Kid': 'success-kid',
  'Squeamish Seal': 'uncomfortable-situation-seal',
  'That Would Be Great (Office Space Bill Lumbergh)': 'bill-lumbergh',
  'The Most Interesting Man in the World': 'most-interesting-man'
}

function getHtml (id, cb) {
  get.concat('http://makeameme.org/meme/' + id, function (err, body) {
    if (err) return cb(err)

    cb(null, body.toString())
  })
}

function parseHtml (html) {
  var $ = cheerio.load(html)

  var memeName = $('meta[name="meme-character-name"]').attr('content')

  if (!memeName) {
    throw new Error('Non-standard meme')
  }

  var memeId = nameMap[memeName.trim()]

  if (!memeId) {
    throw new Error('Unknown meme: ' + memeName)
  }

  return {
    memeId: memeId,
    captions: [
      htmlEntities.decode($('meta[name="meme-top"]').attr('content')).trim(),
      htmlEntities.decode($('meta[name="meme-bottom"]').attr('content')).trim()
    ]
  }
}

exports.extractId = function (url) {
  function main () {
    var re = /http:\/\/makeameme\.org\/meme\/([^/?]+)/
    var m = re.exec(url)

    return (m ? m[1] : null)
  }

  function img () {
    var re = /http:\/\/makeameme\.org\/media\/created\/([^/?]+)\.jpg/
    var m = re.exec(url)

    return (m ? m[1] : null)
  }

  return (main() || img())
}

exports.lookup = function (id, cb) {
  getHtml(id, function (err, html) {
    if (err) return cb(err)

    var info

    try {
      info = parseHtml(html)
    } catch (err) {
      return cb(err)
    }

    cb(null, info)
  })
}
