const Sequelize = require('sequelize');

function defineGuilds(db) {
  const Guilds = db.define('guilds', {
    id: { type: Sequelize.INTEGER, primaryKey: true },
    name: { type: Sequelize.STRING },
    icon: { type: Sequelize.STRING },
    memberCount: { type: Sequelize.STRING },
    ownerID: { type: Sequelize.STRING },
  });
  return Guilds;
}

module.exports = defineGuilds;
