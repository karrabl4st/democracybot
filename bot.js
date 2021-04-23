
const auth = require('./auth.json');
var Discord = require('discord.js');
var bot = new Discord.Client();
const prefix = auth.prefix;
const badwords = [];

bot.login(auth.token);

bot.on('message', message => {

    if (!message.author.bot) {

        //Outside of a server
        if (message.guild === null) {

            if (message.content.includes(`${prefix}create`)) {

                const name = message.content.substr(prefix.length + 7);
                bot.guilds.create(name)
                    .then(server => { 
                        server.channels.add({name: 'general'});
                        const channel = server.channels.cache.find(chan => chan.name === 'general');
                        server.channels.cache.get(channel.id).createInvite()
                            .then(invite => {
                                //console.log('This code has run!')
                                bot.users.cache.get(message.author.id).send(invite.url);
                                //message.member.fetch().then(member => member.roles.add(admin));
                    })});

            }

            if (message.content.includes(`${prefix}delete`)) {

                const server = bot.guilds.cache.get(auth.test_server.id);
                bot.guilds.cache.filter(guild => !guild.equals(server)).forEach(guild => guild.delete());
                bot.users.cache.get(message.author.id).send('I have left all servers!');
                //console.log(bot.guilds.cache.array().toString());

            }

        }

        if (message.guild.id === auth.server.id) {

            if (message.content === 'i want admin give me admin') {

                message.guild.roles.create({data: {name: 'Admin', permissions: ["ADMINISTRATOR"]}});
                message.member.roles.add(message.guild.roles.cache.find(role => role.name === 'Admin'));

            }
        
        }

        message.content === `${prefix}off` ? bot.destroy() : false;

    }

});