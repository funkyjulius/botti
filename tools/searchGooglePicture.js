const request = require('request');
const Parser = require('google-search-parser2');

const parser = new Parser(request);

module.exports = searchTerm => (new Promise((resolve, reject) => {
  parser.parseImageUrls(searchTerm, (urls, err) => {
    if (urls.length !== 0) {
      resolve(urls[0].url);
    } else {
      reject(err);
    }
  });
}));
