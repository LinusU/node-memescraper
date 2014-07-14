
var meme = require('./');
var RedditStream = require('./lib/reddit-stream');

var ee = new RedditStream('adviceanimals');

ee.on('posts', function (posts) {
  posts.forEach(function (post) {
    meme.lookup(post.url, function (err, data) {
      if (err) {
        console.log('ERROR:');
        console.log(post);
        console.log(err.stack);
        console.log();
      }

      if (data) {
        console.log('.');
        // console.log('POST:');
        // console.log(post.title);
        // console.log(data);
        // console.log();
      }

    });
  });
});
