const Keepalive = require("./server.js")
  (async () => {

    const Discord = require("discord.js");
    const Database = require("easy-json-database");
    const devMode = typeof __E_IS_DEV !== "undefined" && __E_IS_DEV;
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const s4d = {
      Discord,
      database: new Database(`${devMode ? S4D_NATIVE_GET_PATH : "."}/db.json`),
      joiningMember: null,
      reply: null,
      tokenInvalid: false,
      tokenError: null,
      checkMessageExists() {
        if (!s4d.client) throw new Error('You cannot perform message operations without a Discord.js client')
        if (!s4d.client.readyTimestamp) throw new Error('You cannot perform message operations while the bot is not connected to the Discord API')
      }
    };
    s4d.client = new s4d.Discord.Client({
      intents: [Object.values(s4d.Discord.Intents.FLAGS).reduce((acc, p) => acc | p, 0)],
      partials: ["REACTION"]
    });

    var arguments2, command, member_xp, member_level, text;


    await s4d.client.login(TOKEN).catch((e) => {
      s4d.tokenInvalid = true;
      s4d.tokenError = e;
    });

    s4d.client.on('messageCreate', async (s4dmessage) => {
      arguments2 = (s4dmessage.content).split(' ');
      command = arguments2.splice(0, 1)[0];
      if (command == '!say') {
        s4dmessage.channel.send(String((arguments2.join(' '))));
      }
      if (!((s4dmessage.member).user.bot)) {
        member_xp = s4d.database.get(String(('xp-' + String(s4dmessage.author.id))));
        member_level = s4d.database.get(String(('level-' + String(s4dmessage.author.id))));
        if (!member_xp) {
          member_xp = 0;
        } else if (!member_level) {
          member_level = 0;
        }
        s4d.database.set(String(('xp-' + String(s4dmessage.author.id))), (member_xp + 1));
        member_xp = member_xp + 1;
        if (member_xp > 100) {
          s4d.database.set(String(('level-' + String(s4dmessage.author.id))), (member_level + 1));
          member_level = member_level + 1;
          s4dmessage.channel.send(String((['Congratulations, ', s4dmessage.member, 'you jumped to level ', member_level, '!!'].join(''))));
        }
        if ((s4dmessage.content) == '!level') {
          s4dmessage.channel.send(String(([s4dmessage.member, ', you are currently level: ', member_level].join(''))));
        } else if ((s4dmessage.content) == '!xp') {
          s4dmessage.channel.send(String(([s4dmessage.member, ', you need ', 100 - member_xp, ' to jump to level ', member_level + 1].join(''))));
        }
      }
      if ((s4dmessage.content) == '!ping') {
        s4dmessage.channel.send(String(('pong!' + String(' Bot ping' + String(String(s4d.client.ws.ping) + String(' Tracked joins :' + String(s4d.database.get(String('tracked joins ')))))))));
      }
      if (text.slice(0, 7) == '!Status') {
        s4dmessage.channel.send(s4d.database.get(String(((s4dmessage.mentions.members.first()).user.id))));
      }
      if (member_level == 1) {
        s4d.database.set(String(((s4dmessage.member).user.id)), 'talker');
      }
      if (member_level == 5) {
        s4d.database.set(String(((s4dmessage.member).user.id)), 'hard worker ');
      }

    });

    await s4d.client.login('TOKEN').catch((e) => {
      s4d.tokenInvalid = true;
      s4d.tokenError = e;
    });

    s4d.client.on('messageCreate', async (s4dmessage) => {

    });

    s4d.client.on('messageCreate', async (s4dmessage) => {

    });

    s4d.client.on('guildMemberAdd', async (param1) => {
      s4d.joiningMember = param1;
      s4d.database.set(String(((s4d.joiningMember).user.id)), 'new');
      s4d.database.add(String('tracked joins '), parseInt(1));
      s4d.joiningMember = null
    });

    Keepalive()
    return s4d;
  });
  
