var bases = require('bases')

var ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function decode (str) {
  const reversed = str.split('').reverse().join('')

  return String(bases.fromAlphabet(reversed, ALPHABET))
}

exports.extractId = function (url) {
  function direct () {
    var re = /http:\/\/www\.memes\.com\/meme\/([0-9]+)/
    var m = re.exec(url)

    return (m ? m[1] : null)
  }

  function short () {
    var re = /http:\/\/www\.memes\.com\/m\/([a-z0-9A-Z]+)/
    var m = re.exec(url)

    return (m ? decode(m[1]) : null)
  }

  function image () {
    var re = /http:\/\/www\.memes\.com\/r\/([a-z0-9A-Z]+)/
    var m = re.exec(url)

    return (m ? decode(m[1]) : null)
  }

  return (direct() || short() || image())
}
