
var events = require('events');
var request = require('./request');

var EventEmitter = events.EventEmitter;

function RedditStream (subreddit) {
  this.subreddit = subreddit;
  EventEmitter.call(this);
  this._fetched = [];
  this._fetch(100);
}

RedditStream.prototype = Object.create(EventEmitter.prototype);

RedditStream.prototype._fetch = function (limit) {

  var ee = this;
  var url = 'http://www.reddit.com/r/' + this.subreddit + '/new.json?limit=' + limit;

  request.get(url, function (err, res) {
    if (err) { return ee.emit('error', err); }

    var data;

    try {
      data = JSON.parse(res.body);
    } catch (err) {
      return ee.emit('error', ee);
    }

    var posts = data.data.children.map(function (data) {
      return {
        author: data.data.author,
        name: data.data.name,
        title: data.data.title,
        url: data.data.url
      };
    }).filter(function (post) {
      return (ee._fetched.indexOf(post.name) === -1);
    });

    posts.forEach(function (post) {
      ee._fetched.push(post.name);
    });

    if (posts.length) {
      ee.emit('posts', posts);
    }

    setTimeout(function () {
      ee._fetch(35);
    }, 30000);
  });

}

module.exports = RedditStream;
