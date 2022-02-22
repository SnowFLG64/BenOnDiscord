const { Client, Intents, Permissions } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json'))
client.login(config.token);

const randomactions = [
  "Eat",
  "Drink",
  "Newspaper",
  "Break"
]

client.on('ready', () => { 
  console.log('Ben On Discord')
  client.user.setActivity(`Talking Ben`, { type: "PLAYING" })
  var newspaperstate = 'closed'
  setInterval (function () {
    var srvconfig = JSON.parse(fs.readFileSync('./server_config.json'));
    action = randomactions[Math.floor(Math.random() * randomactions.length)]
    if (action == "Newspaper") {
      if (newspaperstate == 'closed') {
        action = 'OpenNewspaper';
        newspaperstate = 'open';
      } else {
        action = 'CloseNewspaper';
        newspaperstate = 'closed';
      }
    }
    srvconfig.forEach((srv) => {
      if (srv.benchannel != "false") {
        benChannel = client.channels.fetch(srv.benchannel).then(channel => channel.send(`https://sparrkz.tk/dumb-files/${action}.mp4`))
      }
    })
  }, 600000);
});

client.on('guildDelete', (guild) => {
  var serverconfig = JSON.parse(fs.readFileSync('./server_config.json'));
  var n = serverconfig.findIndex(x => x.server == guild.id)
  serverconfig.splice(n,1);
  var newJson = JSON.stringify(serverconfig, null, 2);
  fs.writeFileSync(`./server_config.json`, newJson);
})

client.on('guildCreate', (guild) => {
  let entry = {
    "server": guild.id,
    "videos": "false",
    "benchannel": "false"
  }
  serverconfig.unshift(entry);
  var newJson = JSON.stringify(serverconfig, null, 2);
  fs.writeFileSync(`./server_config.json`, newJson);
})

const responses = [
  "Ben",
  "Yes",
  "No",
  "Ugh",
  "Ho Ho Ho",
  "Na Na Na Na",
  "USERMESSAGE"
]

client.on('messageCreate', (message) => {
  if (message.author !== client.user) {
    const serverconfig = JSON.parse(fs.readFileSync('./server_config.json'));
    var n = serverconfig.findIndex(x => x.server == message.guild.id)
    if (message.content.startsWith('b!talk')) {
      var rmstring = `b!talk`;
      var saying = message.content.substring(rmstring.length + 1);
      var isBen = true;
    } else if (message.content.startsWith('b!videos')) {
      if (message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
        var entry = serverconfig[n];
        if (entry.videos == "false") {
          var videos = "true";
          var response = "Yes";
        } else {
          var videos = "false";
          var response = "No";
        }
        var newEntry = {
          "server": message.guild.id,
          "videos": videos,
          "benchannel": serverconfig[n]["benchannel"]
        }
        serverconfig.splice(n,1,newEntry);
        var newJson = JSON.stringify(serverconfig, null, 2);
        fs.writeFileSync(`./server_config.json`, newJson);
        if (videos == "true") {
          message.channel.send(`https://sparrkz.tk/dumb-files/${response}.mp4`)
        } else {
          message.channel.send(response);
        }
        return;
      } else {
        message.channel.send('You Do Not Have The `Manage Channels` Permission');
        return;
      }
    } else if (message.content.startsWith('b!benchannel')) {
      if (message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
        var rmstring = `b!benchannel`;
        var channelid = message.content.substring(rmstring.length + 1);
        if (channelid == "") {
          channelid = message.channel.id;
        }
        if (channelid == "unset") {
          channelid = "false";
        }
        var newEntry = {
          "server": message.guild.id,
          "videos": serverconfig[n]["videos"],
          "benchannel": channelid
        }
        serverconfig.splice(n,1,newEntry);
        var newJson = JSON.stringify(serverconfig, null, 2);
        fs.writeFileSync(`./server_config.json`, newJson);
        if (serverconfig[n]["videos"] == "true") {
          message.channel.send(`https://sparrkz.tk/dumb-files/Yes.mp4`)
        } else {
          message.channel.send('Yes');
        }
      } else {
        message.channel.send('You Do Not Have The `Manage Channels` Permission');
        return;
      }
    } else if ((message.content.startsWith('b!help')) || (message.mentions.has(client.user) && message.content.includes('help'))) {
      message.channel.send(`\`b!talk <say anything>\` - Talk To Ben On Discord`);
      message.channel.send(`\`b!videos\` - Change If Ben On Discord Sends Videos Or Not`);
      message.channel.send(`\`b!benchannel <channel-id || 'unset'>\` - Set A Channel Where Ben On Discord Responds Messages And Sends Things Randomly`);
      return;
    } else if (serverconfig[n]["benchannel"] == message.channel.id) {
      var saying = message.content;
      var isBen = true;
    }
    if (isBen) {
      var response = responses[Math.floor(Math.random() * responses.length)];
      if (response == "USERMESSAGE") {
        if (saying == "") {
          var newresponses = responses.splice(0, responses.length - 1);
          var response = 'No'
          if (serverconfig[n]["videos"] == "true") {
            message.channel.send(`https://sparrkz.tk/dumb-files/${response}.mp4`)
          } else {
            message.channel.send(response);
          }
        }
        message.channel.send(`*${saying}*`);
      } else {
        if (serverconfig[n]["videos"] == "true") {
          if (response == "Ho Ho Ho") {
            response = "Laugh";
          }
          if (response == "Na Na Na Na") {
            response = "NaNaNaNa";
          }
          message.channel.send(`https://sparrkz.tk/dumb-files/${response}.mp4`)
        } else {
          message.channel.send(response);
        }
      }
    }
  }
});
