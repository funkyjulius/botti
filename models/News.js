const Sequelize = require('sequelize');

function defineNews(db) {
  const News = db.define('news', {
    headline: { type: Sequelize.STRING },
    url: { type: Sequelize.STRING },
    picture: { type: Sequelize.STRING },
  });
  return News;
}

module.exports = defineNews;
