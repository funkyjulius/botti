const Sequelize = require('sequelize');

function defineDiscordUsers(db) {
  const DiscordUsers = db.define('discordUsers', {
    id: { type: Sequelize.INTEGER, primaryKey: true },
    username: { type: Sequelize.STRING },
    avatar: { type: Sequelize.STRING },
    discriminator: { type: Sequelize.INTEGER },
    bot: { type: Sequelize.BOOLEAN },
    email: { type: Sequelize.STRING },
  });
  return DiscordUsers;
}

module.exports = defineDiscordUsers;
