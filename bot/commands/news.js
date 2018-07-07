const scraper = require('../../scraper');

module.exports = {
  name: 'news',
  description: 'Get latest news from Ampparit.',
  guildOnly: true,
  cooldown: 500,
  execute(message) {
    scraper.news().then(msg => message.channel.send(msg));
  },
};
