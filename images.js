
var livememe = require('../provider/livememe');

function albumIdToImageUri (albumId) {
  return 'http://i1.livememe.com/' + base36intToBytes(albumId) + '_3';
};

Object.keys(livememe._map).forEach(function (id) {
  console.log('wget "' + albumIdToImageUri(id) + '" -O ' + livememe._map[id] + '.jpg');
});
