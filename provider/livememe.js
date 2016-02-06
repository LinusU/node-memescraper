
var get = require('simple-get');
var bases = require('bases');

var hasSpecialBackground = [
    32469525,
    67691413,
   193086249,
   411372063,
   433055911,
   957036031,
  1814860867,
  1866968882,
  2067218646
];

var albumMap = {
    32469525: 'insanity-wolf',
    67691413: 'success-kid',
   119956028: 'thats-my-secret',
   140429993: 'scumbag-stacy',
   188761322: 'that-was-a-lie',
   193086249: 'socially-awkward-penguin',
   290868921: 'good-guy-greg',
   305532646: 'one-does-not-simply',
   335890722: 'matrix-morpheus',
   377029423: 'inigo-montoya',
   411372063: 'courage-wolf',
   422616727: 'what-year-is-it',
   433055911: 'socially-awesome-awkward-penguin',
   467227073: 'andy-bernard',
   540497219: 'actual-advice-mallard',
   566256807: 'grinds-my-gears',
   608501532: 'first-world-problems',
   614508845: 'i-guarantee-it',
   738056925: 'terrible-twist-tiger',
   743450879: 'and-its-gone',
   796111217: 'futurama-fry',
   835671626: 'yall-got-anymore-of',
   845318864: 'most-interesting-man',
   855846422: 'too-damn-high',
   865234470: 'drew-carey',
   894520680: 'fuck-me-right',
   943730480: 'bad-luck-brian',
   957036031: 'socially-awesome-awkward-penguin',
   977169042: 'maximus',
  1006653337: 'sudden-clarity-clarence',
  1039911681: 'bad-joke-eel',
  1063852799: 'uncomfortable-situation-seal',
  1221991539: 'annoyed-picard',
  1281404335: 'annoyed-picard',
  1302953534: 'small-fact-frog',
  1375896540: 'weird-stuff-i-do-potoo',
  1560330077: 'bill-lumbergh',
  1648134789: 'you-da-real-mvp',
  1686109177: 'captain-hindsight',
  1796830866: 'confession-kid',
  1814860867: 'ordinary-muslim-man',
  1822368979: 'confession-bear',
  1823813376: 'redditors-wife',
  1827948429: 'toy-story-everywhere',
  1844359501: 'archer-ants',
  1866968882: 'foul-bachelor-frog',
  1885601480: 'sophisticated-cat',
  1898926100: 'angry-advice-mallard',
  1916763872: 'craig-would-be-so-happy',
  1920767455: 'college-liberal',
  1950061337: 'scumbag-couple',
  1953842485: 'look-at-all-the',
  1990770731: 'unhelpful-high-school-teacher',
  2002353539: 'confused-gandalf',
  2067218646: 'paranoid-parrot',
  2074256758: 'so-i-got-that-going-for-me',
  2093456784: 'scumbag-steve'
};

function urlIdToTemplateId (urlId) {
  var v = bases.fromBase36(urlId);
  var template_sid = v % 32;
  var w = (v - template_sid) / 32;

  return bases.toBase36(w);
}

function getTemplateData (templateId, cb) {
  get.concat('http://j1.livememe.com/3113_t' + templateId, function (err, body) {
    if (err) { return cb(err); }

    var m = /setTemplate\(\{\"data\"\: \"([0-9A-F]+)\"\}\)\;/.exec(body.toString());

    if (!m) { return cb(new Error('Failed to parse template data')); }

    cb(null, new Buffer(m[1], 'hex'));
  });
}

function parseTemplateData (templateData) {

  var albumId = templateData.readUInt32BE(6);
  var captionStart = 39;

  if (~hasSpecialBackground.indexOf(albumId)) {
    captionStart = 31;
  }

  for (var topLength = 0; templateData[captionStart + topLength]; topLength++) {};
  for (var botLength = 0; templateData[captionStart + topLength + 17 + botLength]; botLength++) {};

  var memeId = albumMap[albumId];

  if (!memeId) {
    throw new Error('Unknown album: ' + templateData.readUInt32BE(6));
  }

  // width: templateData.readUInt16BE(18)
  // height: templateData.readUInt16BE(20)

  return {
    memeId: memeId,
    captions: [
      templateData.slice(captionStart, captionStart + topLength).toString(),
      templateData.slice(captionStart + topLength + 17, captionStart + topLength + 17 + botLength).toString()
    ]
  };
}

exports.extractId = function (url) {

  function main() {
    var re = /http:\/\/www\.livememe\.com\/([0-9a-z]+)/;
    var m = re.exec(url);

    return (m ? m[1] : null);
  }

  function img() {
    var re = /http:\/\/i\.lvme\.me\/([0-9a-z]+)_?[0-9]?\.jpg/;
    var m = re.exec(url);

    return (m ? m[1] : null);
  }

  return (main() || img());
};

exports.lookup = function (id, cb) {

  var templateId = urlIdToTemplateId(id);

  getTemplateData(templateId, function (err, templateData) {
    if (err) { return cb(err); }

    var info;

    try {
      info = parseTemplateData(templateData);
    } catch (err) {
      return cb(err);
    }

    cb(null, info);
  });

};
