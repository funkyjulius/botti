const fs = require('fs');
const Discord = require('discord.js');
const { BOT_PREFIX, BOT_TOKEN } = require('dotenv').config().parsed;

const client = new Discord.Client();

module.exports = {
  postOnDiscordChannels(header, url, picture, channelName) {
    const embed = new Discord.RichEmbed()
      .setTitle(header)
      .setColor('AQUA')
      .setImage(picture)
      .setURL(url)
      .setTimestamp();

    client.channels
      .filter(chan => chan.name.toLowerCase() === channelName.toLowerCase())
      .map(channel => channel.send({ embed }).catch(console.error));
  },

  run() {
    client.commands = new Discord.Collection();

    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

    commandFiles.forEach((file) => {
      const command = require(`./commands/${file}`);
      client.commands.set(command.name, command);
    });

    const cooldowns = new Discord.Collection();

    client.on('ready', () => {
      console.log('Botti käynnissä!');
    });

    client.on('message', (message) => {
      if (!message.content.startsWith(BOT_PREFIX) || message.author.bot) return;

      const args = message.content.slice(BOT_PREFIX.length).split(/ +/);
      const commandName = args.shift().toLowerCase();

      const command = client.commands.get(commandName)
              || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

      if (!command) {
        message.delete();
        message.reply('Komentoa ei ole olemassa!');
        return;
      }

      if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply('I can\'t execute that command inside DMs!');
      }

      if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        if (command.usage) {
          reply += `\nThe proper usage would be: \`${BOT_PREFIX}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
      }

      if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
      }

      const now = Date.now();
      const timestamps = cooldowns.get(command.name);
      const cooldownAmount = (command.cooldown || 3) * 1000;

      if (!timestamps.has(message.author.id)) {
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
      } else {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000;
          return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
      }

      try {
        command.execute(message, args);
      } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
      }
    });

    client.login(BOT_TOKEN);
  },

};
