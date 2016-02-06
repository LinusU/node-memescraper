# Memescraper

Scrape meme information from urls.

## Installation

```sh
npm install --save memescraper
```

## Usage

```javascript
const memescraper = require('memescraper')

// Lookup info

memescraper.lookup('http://www.livememe.com/3t1je69', function (err, res) {
  if (err) throw err

  console.log(res.memeId) // most-interesting-man

  console.log(res.captions[0]) // I DON’T ALWAYS DRINK BEER
  console.log(res.captions[1]) // BUT WHEN I DO, I PREFER DOS EQUIS
})

// Parse URL

const info = memescraper.parse('http://www.livememe.com/3t1je69')

console.log(info.provider) // livememe
console.log(info.id) // 3t1je69
```

## CLI

```text
$ memescraper "http://www.livememe.com/3t1je69"
{
  "memeId": "most-interesting-man",
  "captions": [
    "I DON’T ALWAYS DRINK BEER",
    "BUT WHEN I DO, I PREFER DOS EQUIS"
  ]
}
```

## API

### `memescraper.parse(url)` -> `{ provider, id }`

Parse a url into the corresponding provider and id.

### `memescraper.lookup(url, cb)` -> `cb(err, { memeId, captions })`

Lookup the type of meme and captions for the given url.

### `memescraper.lookup(info, cb)` -> `cb(err, { memeId, captions })`

Lookup the type of meme and captions for the given provider and id. `info`
should be in the same format as returned by `.parse(url)`.
