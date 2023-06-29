// Fiverr: https://www.fiverr.com/amirdev_78

const {
    Client,
    GatewayIntentBits,
    Partials,
    SlashCommandBuilder
} = require("discord.js");
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Reaction,
        Partials.GuildScheduledEvent,
        Partials.User,
        Partials.ThreadMember
    ],
});
const { botToken } = require('./config.json');
const { QuickDB } = require("quick.db");
const db = new QuickDB();


const setavailable = new SlashCommandBuilder()
    .setName('setavailable')
    .setDescription('Replies with your input!')
    .addStringOption(option =>
        option.setName('time')
            .setDescription('Use 24-hour format (00:00 - 23:59)')
            .setMaxLength(5)
            .setMinLength(5)
            .setRequired(true))
    .addStringOption(option =>
        option.setName('gmt')
            .setDescription('Your time zone (Like: +02:00)')
            .setMaxLength(6)
            .setMinLength(6)
            .setRequired(true));

let available = new SlashCommandBuilder()
    .setName('available')
    .setDescription('Get the user\'s available time')
    .addUserOption(option =>
        option
            .setName('target')
            .setDescription('mention the user.')
            .setRequired(true));


let availablenow = new SlashCommandBuilder()
    .setName('availablenow')
    .setDescription('get currently available users.')



client.on('ready', () => {
    console.log(`${client.user.tag} is Ready !!`)
    client.guilds.cache.forEach((guild) => {
        guild.commands?.create(setavailable.toJSON())
        guild.commands?.create(available.toJSON())
        guild.commands?.create(availablenow.toJSON());

    })
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName == 'setavailable') {
        let time = interaction.options.getString('time');
        let gmt = interaction.options.getString('gmt');

        let date = new Date()
        let format = `${+date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()} ${time} GMT${gmt}`

        let s = new Date(format);

        if (s.toString().includes("Invalid")) return interaction.reply('**You must do something like: \n`/setavailable time:10:30 gmt:+02:00`**');


        s = s.getTime().toString()

        s = s.substring(0, s.length - 3);

        await db.set(interaction.user.id, { time, gmt });
        console.log(await db.get(interaction.user.id))


        interaction.reply({ content: `<t:${s}:R>` }); //EDIT

    } else if (interaction.commandName == 'available') {
        let user = interaction.options.getUser('target');
        let data = await db.get(user.id);
        if (!data) return interaction.reply('This user hasn\'t set the available time.');
        let { time, gmt } = data;
        let date = new Date()
        let format = `${+date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()} ${time} GMT${gmt}`

        let s = new Date(format);

        if (s.toString().includes("Invalid")) return interaction.reply('**You must do something like: \n`/setavailable time:10:30 gmt:+02:00`**');


        s = s.getTime().toString()

        s = s.substring(0, s.length - 3);

        interaction.reply(`This user available <t:${s}:R>.`); //EDIT
    } else if (interaction.commandName == 'availablenow') {
        let ids = [];
        const allData = await db.all();
        allData.forEach(data => {
            let userID = data.id;
            let time = data.value.time;
            let gmt = data.value.gmt;

            let t = new Date()
                .getTime().toString();
            t = t.substring(0, t.length - 3);
            let date = new Date()
            let format = `${+date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()} ${time} GMT${gmt}`

            let s = new Date(format);

            if (s.toString().includes("Invalid")) return interaction.reply('**You must do something like: \n`/setavailable time:10:30 gmt:+02:00`**');


            s = s.getTime().toString()

            s = s.substring(0, s.length - 3);

            console.log(+t, +s, (+t - 600))
            if (+t > +s) {
                if ((+t - 600) < +s) {
                    console.log('.')
                    ids.push(userID);
                }
            }
        });
        if (ids.length < 1) {
            interaction.reply('Nobody is available now.')
        } else {
            let i;
            if (10 > ids.length) {
                i = ids.length
            } else {
                i = 10
            }
            let users = [];
            for (a = 0; a < i; a++) {
                let { time, gmt } = await db.get(ids[a]);

                let date = new Date()
                let format = `${+date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()} ${time} GMT${gmt}`

                let s = new Date(format);

                if (s.toString().includes("Invalid")) return interaction.reply('**You must do something like: \n`/setavailable time:10:30 gmt:+02:00`**');


                s = s.getTime().toString()

                s = s.substring(0, s.length - 3);

                users.push(`<@!${ids[a]}> is available <t:${s}:R>.`);



            }
            console.log(users)
            interaction.reply(`${users.join('\n')} `)
        }
    }
})

client.login(botToken).catch((err) => console.log('Bad token.'));

// Fiverr: https://www.fiverr.com/amirdev_78