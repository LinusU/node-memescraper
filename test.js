/* eslint-env mocha */

'use strict'

const assert = require('assert')
const lookup = require('./').lookup

const PROVIDERS = [
  'livememe',
  'makeameme',
  'memecaptain',
  'memegenerator'
]

const MEMES = [
  {
    id: 'most-interesting-man',
    title: 'The Most Interesting Man in the World',
    captions: [
      'I DON’T ALWAYS DRINK BEER',
      'BUT WHEN I DO, I PREFER DOS EQUIS'
    ],
    urls: {
      livememe: 'http://www.livememe.com/3t1je69',
      makeameme: 'http://makeameme.org/meme/i-dont-always-0jrb52',
      memecaptain: 'http://memecaptain.com/gend_image_pages/tgSmrQ',
      memegenerator: 'http://memegenerator.net/instance/66806524'
    }
  }
]

describe('Memescraper', function () {
  for (let meme of MEMES) {
    describe(meme.title, function () {
      for (let provider of PROVIDERS) {
        it('should fetch from ' + provider, function (done) {
          lookup(meme.urls[provider], function (err, result) {
            assert.ifError(err)

            assert.equal(result.memeId, meme.id)
            assert.deepEqual(result.captions, meme.captions)

            done()
          })
        })
      }
    })
  }
})
