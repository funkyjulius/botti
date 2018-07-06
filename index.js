const express = require('express');
const app = express();
const Botti = require(`./bot.js`);

// Botti.run();

app.get('/', function (req, res) {
  	res.send("Botti rullaa")
});
  
const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://girlnqbytwbqch:d3e0c1a873596a320bfe4f9080becc8648fc4733ef57719e6b090b1be83374eb@ec2-174-129-225-9.compute-1.amazonaws.com:5432/d5806lf6h10kti',{dialect:"postgres",
ssl: true,
dialectOptions: {
	"ssl": true
}});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

  const User = sequelize.define('user', {
	firstName: {
	  type: Sequelize.STRING
	},
	lastName: {
	  type: Sequelize.STRING
	}
  });
  
  // force: true will drop the table if it already exists
  User.sync({force: true}).then(() => {
	// Table created
	return User.create({
	  firstName: 'John',
	  lastName: 'Hancock'
	});
  });

  User.findAll().then(users => {
	console.log(users)
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