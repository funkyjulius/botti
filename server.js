const express = require('express');
const { CronJob } = require('cron');
const { db } = require('./models/index');
const scraper = require('./scraper');
const Botti = require('./bot.js');

const app = express();
const PORT = process.env.PORT || 8080;

Botti.run();

app.get('/', (req, res) => {
  res.send('Botti rullaa');
});

// const getNewsTimer = new CronJob({
//   cronTime: '*/60 * * * *', // Every 60min
//   onTick: function() {
//     console.log('lol');
//   },
//   start: true,
// });

// getNewsTimer.start();

db
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    scraper.news();
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

app.listen(PORT);

console.log(`Botti hengittää kolossa ${PORT}`);
