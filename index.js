const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json'))

// check config.json
client.login(config.token);

client.on('ready', () => console.log('Ben On Discord'));

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
    // get server settings
    const serverconfig = JSON.parse(fs.readFileSync('./server_config.json'));
    var n = serverconfig.findIndex(x => x.server == message.guild.id)

    if (message.content.startsWith('b!talk')) {
    // talk to ben
      if (n == "-1") {
        message.channel.send('Ben On Discord Not Set Up (b!setup)')
      } else {
        var rmstring = `b!talk`;
        var saying = message.content.substring(rmstring.length + 1);
        var isBen = true;
      }
    } else if (message.content.startsWith('b!setup')) {
    // set up ben
      if (n == "-1") {
        let entry = {
          "server": message.guild.id,
          "videos": "false",
          "benchannel": "false"
        }
        serverconfig.unshift(entry);
        var newJson = JSON.stringify(serverconfig, null, 2);
        fs.writeFileSync(`./server_config.json`, newJson);
        message.channel.send('Ben On Discord');
        return;
      } else {
        message.channel.send('Ben On Discord Already Set Up');
        return;
      }
    } else if (message.content.startsWith('b!videos')) {
    // change ben's video setting
      if (n == "-1") {
        message.channel.send('Ben On Discord Not Set Up (b!setup)')
      } else {
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
      }
    } else if (message.content.startsWith('b!benchannel')) {
    // set the talking ben channel
      if (n == "-1") {
        message.channel.send('Ben On Discord Not Set Up (b!setup)')
      } else {
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
      }
    } else if ((message.content.startsWith('b!help')) || (message.mentions.has(client.user) && message.content.includes('help'))) {
    // help command
      if (n == "-1" ) {
        message.channel.send(`b!setup - Set Up Ben On Discord`);
      } else {
        message.channel.send(`b!talk <say anything> - Talk To Ben On Discord`);
        message.channel.send(`b!videos - Change If Ben On Discord Sends Videos Or Not`);
        message.channel.send(`b!benchannel <channel-id || 'unset'> - Set A Channel Where Ben On Discord Responds Messages And Sends Things Randomly`);
      }
      return;
    } else if (n !== "-1" && serverconfig[n]["benchannel"] == message.channel.id) {
    // respond inside of talking ben channel
      var saying = message.content;
      var isBen = true;
    }
    if (isBen) {
    // responses to b!talk

      // set responses (based off of IShowSpeed's interactions)
      var response = responses[Math.floor(Math.random() * responses.length)];
      if (saying.toLowerCase().includes('are you gay')) {
        response = 'Yes';
      } else if (saying.toLowerCase().includes('do you love god')) {
        response = 'No';
      } else if (saying.toLowerCase().includes('do you support lgbtq')) {
        response = 'No';
      } else if (saying.toLowerCase().includes('do you support black lives matter')) {
        response = 'Yes';
      } else if (saying.toLowerCase() == "yes") {
        response = 'No';
      } else if (saying.toLowerCase() == "no") {
        response = 'Yes';
      } else if (saying.toLowerCase().includes('stop')) {
        response = 'No';
      }

      // mock user
      if (response == "USERMESSAGE") {
        if (saying == "") {
          var newresponses = responses.splice(0, responses.length - 1);
          var response = newresponses[Math.floor(Math.random() * newresponses.length)];
          if (serverconfig[n]["videos"] == "true") {
            if (response == "Ho Ho Ho") {
              response = "Laugh";
            } else if (response == "Na Na Na Na") {
              response = "NaNaNaNa";
            }
            message.channel.send(`https://sparrkz.tk/dumb-files/${response}.mp4`)
          } else {
            message.channel.send(response);
          }
        }
        message.channel.send(`**${saying}**`);
      } else {
      // send video response
        if (serverconfig[n]["videos"] == "true") {
          if (response == "Ho Ho Ho") {
            response = "Laugh";
          } else if (response == "Na Na Na Na") {
            response = "NaNaNaNa";
          }
          message.channel.send(`https://sparrkz.tk/dumb-files/${response}.mp4`)
        } else {
        // send text response
          message.channel.send(response);
        }
      }
    }
  }
});