const request = require('request');
const Parser = require('google-search-parser2');
const { db } = require('../models/index');
const getNews = require('./news');

const parser = new Parser(request);

module.exports = {
  news() {
    return new Promise((resolve, reject) => {
      db.models.news.findAll({
        limit: 1,
        order: [['createdAt', 'DESC']],
      }).then((entries) => {
        const latestHeadline = (entries.length === 0 ? '' : entries.shift().get('headline'));
        console.log('Latest headline:', latestHeadline);
        return resolve(getNews(db, latestHeadline));
      }).catch(err => reject(err));
    });
  },

  pictureSearchGoogle(searchTerm) {
    return new Promise((resolve, reject) => {
      parser.parseImageUrls(searchTerm, (urls, err) => {
        if (urls.length !== 0) {
          resolve(urls[0].url);
        } else {
          reject(err);
        }
      });
    });
  },
};
