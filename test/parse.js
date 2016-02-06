/* eslint-env mocha */

'use strict'

const assert = require('assert')
const parse = require('../').parse

const CASES = [
  ['livememe', '3t1je69', 'http://www.livememe.com/3t1je69'],
  ['livememe', '3t1je69', 'http://i.lvme.me/3t1je69_4.jpg'],

  ['makeameme', 'i-dont-always-0jrb52', 'http://makeameme.org/meme/i-dont-always-0jrb52'],
  ['makeameme', 'i-dont-always-0jrb52', 'http://makeameme.org/media/created/i-dont-always-0jrb52.jpg'],

  ['memecaptain', 'tgSmrQ', 'http://memecaptain.com/gend_image_pages/tgSmrQ'],
  ['memecaptain', 'tgSmrQ', 'http://i.memecaptain.com/gend_images/tgSmrQ.png'],

  ['memegenerator', '66806524', 'http://memegenerator.net/instance/66806524'],
  ['memegenerator', '66806524', 'http://cdn.memegenerator.net/instances/400x/66806524.jpg'],
  ['memegenerator', '66806524', 'http://cdn.meme.am/instances/500x/66806524.jpg']
]

describe('Memescraper - parse', function () {
  for (let testCase of CASES) {
    it('it should parse ' + testCase[2], function () {
      assert.deepEqual(parse(testCase[2]), { provider: testCase[0], id: testCase[1] })
    })
  }
})
