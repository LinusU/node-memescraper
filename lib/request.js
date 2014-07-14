
var url = require('url');
var http = require('http');

function run (opts, cb) {

  var req = http.request(opts, function (res) {

    if ((res.statusCode / 100 | 0) !== 2) {
      cb(new Error('Server responded with status code: ' + res.statusCode));
    }

    var chunks = [];

    res.on('data', function (chunk) {
      chunks.push(chunk);
    });

    res.on('end', function () {
      var body = Buffer.concat(chunks).toString();

      cb(null, {
        body: body,
        headers: res.headers,
        statusCode: res.statusCode
      });
    });

    res.on('error', cb);

  });

  req.on('error', cb);

  if (opts.body) {
    throw new Error('Not implemented');
  } else {
    req.end();
  }

}

exports.get = function (uri, cb) {
  var opts = url.parse(uri);
  opts.method = 'GET';

  run(opts, cb);
};
