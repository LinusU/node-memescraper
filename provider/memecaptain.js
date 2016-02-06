
var get = require('simple-get');
var cheerio = require('cheerio');

var nameMap = {
  'actual advice mallard': 'actual-advice-mallard',
  'annoyed picard':        'annoyed-picard',
  'archer because':        'archer-ants',
  'captain hindsight':     'captain hindsight',
  'confession bear':       'confession-bear',
  'first world problems':  'first-world-problems',
  'fry not sure if':       'futurama-fry',
  'insanity wolf':         'insanity-wolf',
  'matrix morpheus':       'matrix-morpheus',
  'most interesting man in the world i don\'t always': 'most-interesting-man',
  'scumbag stacy':         'scumbag-stacy',
  'success kid':           'success-kid',
  'squeamish seal':        'uncomfortable-situation-seal'
};

function getHtml (id, cb) {
  get.concat('http://memecaptain.com/gend_image_pages/' + id, function (err, body) {
    if (err) { return cb(err); }

    cb(null, body.toString());
  });
}

function parseHtml (html) {

  var $ = cheerio.load(html);

  var memeName = $('blockquote small').text().trim();
  var memeId = nameMap[memeName];

  if (!memeId) {
    throw new Error('Unknown meme: ' + memeName);
  }

  return {
    memeId: memeId,
    captions: [
      $('blockquote h1:nth-child(1)').text().trim(),
      $('blockquote h1:nth-child(2)').text().trim()
    ]
  };

}

exports.extractId = function (url) {

  function main () {
    var re = /http:\/\/memecaptain\.com\/gend_image_pages\/([A-Za-z0-9]+)/;
    var m = re.exec(url);

    return (m ? m[1] : null);
  }

  function img () {
    var re = /http:\/\/i\.memecaptain\.com\/gend_images\/([A-Za-z0-9]+)\.png/;
    var m = re.exec(url);

    return (m ? m[1] : null);
  }

  return (main() || img());
};

exports.lookup = function (id, cb) {
  getHtml(id, function (err, html) {
    if (err) { return cb(err); }

    var info;

    try {
      info = parseHtml(html);
    } catch (err) {
      return cb(err);
    }

    cb(null, info);
  });
};
