const cheerio = require('cheerio');
const rp = require('request-promise');
const { pictureSearchGoogle } = require('../tools');
const { postOnDiscordChannels } = require('../bot');

module.exports = (db, latestHeadline) => {
  const sourceUrl = 'http://www.ampparit.com/p%C3%A4%C3%A4uutiset';
  const newsArticles = [];

  return rp(sourceUrl)
    .then((html) => {
      const $ = cheerio.load(html);
      const content = $('.items-list-header').parent().children();
      const articles = content.filter(el => content[el].name === 'article');

      articles.find('a').each((i, el) => {
        if (!$(el).hasClass('news-item-headline')) { return false; }

        const headline = $(el).text();
        const url = $(el).attr('href');

        if (headline === latestHeadline) {
          console.log('Found from db:', headline);
          // Ends the loop
          return false;
        }

        return newsArticles.push({ headline, url });
      });

      // End the process if there is nothing new to show
      if (newsArticles.length === 0) {
        console.log('No news to post.');
        return 'No news to post.';
      }
      const first = newsArticles[0];

      newsArticles
        .reverse() // Latest news will be shown as newest messages
        .forEach((article) => {
          pictureSearchGoogle(article.headline)
            .then((picture) => {
              postOnDiscordChannels(article.headline, article.url, picture, 'uutiset');

              // Save the most newest article to db
              // to avoid nonsense processing
              if (article.headline === first.headline) {
                console.log('To db:', article.headline);
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
      console.log('News incoming!');
      return 'News incoming!';
    })
    .catch(err => new Error(err));
};
