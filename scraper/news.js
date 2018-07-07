const cheerio = require('cheerio');
const rp = require('request-promise');
const { pictureSearchGoogle } = require('../tools');
const { postOnDiscordChannels } = require('../bot');

module.exports = (db, latestHeadline) => {
  const sourceUrl = 'http://www.ampparit.com/p%C3%A4%C3%A4uutiset';
  const newsArticles = [];

  rp(sourceUrl)
    .then((html) => {
      const $ = cheerio.load(html);
      const content = $('.items-list-header').parent().children();
      const articles = content.filter(el => content[el].name === 'article');

      articles.find('a').each((i, el) => {
        if ($(el).hasClass('news-item-headline')) {
          if (i > 10) return;
          const headline = $(el).text();
          const url = $(el).attr('href');

          if (headline === latestHeadline) { console.log('Found from db:', headline); return false; }
          newsArticles.push({ headline, url });
        }
      });

      if (newsArticles.length === 0) { console.log('No news to post.'); return; }
      const first = newsArticles[0];

      newsArticles
        .reverse()
        .forEach((article) => {
          pictureSearchGoogle(article.headline)
            .then((picture) => {
              postOnDiscordChannels(article.headline, article.url, picture, 'uutiset');

              // Get the latest news
              if (article.headline === first.headline) {
                console.log('Tallentaa', article.headline);
                db.models.news.sync()
                  .then(() => {
                    db.models.news.create({
                      headline: article.headline,
                      url: article.url,
                      picture,
                    });
                  });
              }
            });
        });
    })
    .catch((err) => {
      throw new Error(err);
    });
};
