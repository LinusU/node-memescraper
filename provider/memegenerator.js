
var get = require('simple-get');

var generatorMap = {
     76: 'most-interesting-man',
    303: 'courage-wolf',
  60501: 'bill-lumbergh'
};

function getMemeData (id, cb) {
  get.concat('http://version1.api.memegenerator.net/Instance_Select?instanceID=' + id, function (err, body) {
    if (err) { return cb(err); }

    var data;

    try {
      data = JSON.parse(body.toString());
    } catch (err) {
      return cb(err);
    }

    if (!data.success) {
      return cb(new Error('Unknown server error'));
    }

    cb(null, data.result);
  });
}

function parseData (data) {

  var memeId = generatorMap[data.generatorID];

  if (!memeId) {
    throw new Error('Unknown generator: ' + data.generatorID);
  }

  return {
    memeId: memeId,
    captions: [data.text0, data.text1]
  };
}

exports.extractId = function (url) {

  function main() {
    var re = /http:\/\/memegenerator\.net\/instance\/([0-9]+)/;
    var m = re.exec(url);

    return (m ? m[1] : null);
  }

  function cdn() {
    var re = /http:\/\/cdn\.memegenerator\.net\/instances\/[0-9x]+\/([0-9]+)\.jpg/;
    var m = re.exec(url);

    return (m ? m[1] : null);
  }

  function cdn2() {
    var re = /http:\/\/cdn.meme.am\/instances\/[0-9x]+\/([0-9]+)\.jpg/;
    var m = re.exec(url);

    return (m ? m[1] : null);
  }

  return (main() || cdn() || cdn2());
};

exports.lookup = function (id, cb) {
  getMemeData(id, function (err, data) {
    if (err) { return cb(err); }

    var info;

    try {
      info = parseData(data);
    } catch (err) {
      return cb(err);
    }

    cb(null, info);
  });
};
