const express = require('express');
const { CronJob } = require('cron');
const { db } = require('./models/index');
const scraper = require('./scraper');
const Botti = require('./bot');

const app = express();
const PORT = process.env.PORT || 8080;

Botti.run();

app.get('/', (req, res) => {
  res.send('Botti rullaa');
});

app.listen(PORT);

console.log(`Botti hengittää kolossa ${PORT}`);

const getNewsTimer = new CronJob({
  cronTime: '*/60 * * * *', // Every 60min
  onTick() {
    scraper.news();
  },
  start: true,
});

getNewsTimer.start();

db
  .authenticate()
  .then(() => { console.log('Connection has been established successfully.'); })
  .catch((err) => { console.error('Unable to connect to the database:', err); });
