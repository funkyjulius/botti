const express = require('express');
const app = express();
const Botti = require(`./bot.js`);

Botti.run();

app.get('/', function (req, res) {
  	res.send("Botti rullaa")
})

// app.get('/news', function (req, res) {
//   dbNews.find({}).sort({
//     updatedAt: -1
//   }).exec(function (err, uutiset) {
//     let tuloste = ""
//     if (err) res.send(err);
//     uutiset.forEach(uutinen => {
//       tuloste += "<br><br>" + uutinen.otsikko;
//     })
//     res.send(tuloste)
//   });
// });

app.listen(process.env.PORT || 8080)

console.log('Botti hengittää kolossa 8080');