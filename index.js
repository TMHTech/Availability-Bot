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
    .setDescription('Set your availability!')
    .addStringOption(option =>
        option.setName('start_time')
            .setDescription('Use 24-hour format (00:00 - 23:59)')
            .setMaxLength(5)
            .setMinLength(5)
            .setRequired(true))
    .addStringOption(option =>
        option.setName('end_time')
            .setDescription('Use 24-hour format (00:00 - 23:59)')
            .setMaxLength(5)
            .setMinLength(5)
            .setRequired(true))
    .addStringOption(option =>
        option.setName('gmt')
            .setDescription('Your time zone (Like: +02:00)')
            .setMaxLength(6)
            .setMinLength(6)
            .setRequired(true))
    .addStringOption(option =>
        option.setName('days')
            .setDescription('Days of the week you are available (Like: Mon,Tue,Wed)')
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
        let startTime = interaction.options.getString('start_time');
        let endTime = interaction.options.getString('end_time');
        let gmt = interaction.options.getString('gmt');
        let days = interaction.options.getString('days');

        let date = new Date();
        let startFormat = `${+date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()} ${startTime} GMT${gmt}`;
        let endFormat = `${+date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()} ${endTime} GMT${gmt}`;

        let start = new Date(startFormat);
        let end = new Date(endFormat);

        if (start.toString().includes("Invalid") || end.toString().includes("Invalid")) 
            return interaction.reply('**You must do something like: \n`/setavailable start_time:10:30 end_time:18:00 gmt:+02:00 days:Mon,Tue,Wed`**');

        start = start.getTime().toString();
        end = end.getTime().toString();

        start = start.substring(0, start.length - 3);
        end = end.substring(0, end.length - 3);

        await db.set(interaction.user.id, { startTime, endTime, gmt, days });
        console.log(await db.get(interaction.user.id))

        interaction.reply({ content: `Your availability has been set to <t:${start}:R> to <t:${end}:R> on ${days}` });

    } else if (interaction.commandName == 'available') {
        let user = interaction.options.getUser('target');
        let data = await db.get(user.id);
        if (!data) return interaction.reply('This user hasn\'t set the available time.');
        let { startTime, endTime, gmt, days } = data;
    
        let date = new Date()
        let startFormat = `${+date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()} ${startTime} GMT${gmt}`
        let endFormat = `${+date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()} ${endTime} GMT${gmt}`
    
        let start = new Date(startFormat);
        let end = new Date(endFormat);
    
        if (start.toString().includes("Invalid") || end.toString().includes("Invalid")) 
            return interaction.reply('**Invalid time data. The user must set availability with `/setavailable start_time:10:30 end_time:18:00 gmt:+02:00 days:Mon,Tue,Wed`**');
    
        start = start.getTime().toString();
        end = end.getTime().toString();
    
        start = start.substring(0, start.length - 3);
        end = end.substring(0, end.length - 3);
    
        interaction.reply(`This user is available from <t:${start}:R> to <t:${end}:R> on these days: ${days}.`); //EDIT
    } else if (interaction.commandName == 'availablenow') {
        let ids = [];
        const allData = await db.all();
        allData.forEach(data => {
            let userID = data.id;
            let startTime = data.value.startTime;
            let endTime = data.value.endTime;
            let gmt = data.value.gmt;
            let days = data.value.days.split(',');
    
            let t = new Date()
                .getTime().toString();
            t = t.substring(0, t.length - 3);
    
            let date = new Date()
            let startFormat = `${+date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()} ${startTime} GMT${gmt}`
            let endFormat = `${+date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()} ${endTime} GMT${gmt}`
    
            let start = new Date(startFormat);
            let end = new Date(endFormat);
    
            if (start.toString().includes("Invalid") || end.toString().includes("Invalid")) 
                return interaction.reply('**Invalid time data. Users must set availability with `/setavailable start_time:10:30 end_time:18:00 gmt:+02:00 days:Mon,Tue,Wed`**');
    
            start = start.getTime().toString();
            end = end.getTime().toString();
    
            start = start.substring(0, start.length - 3);
            end = end.substring(0, end.length - 3);
    
            let currentDay = new Date().getDay();
            let dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    if (days.includes(dayNames[currentDay]) && (+t > +start) && (+t < +end)) {
        ids.push(userID);
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
            let { startTime, endTime, gmt, days } = await db.get(ids[a]);
    
            let date = new Date()
            let startFormat = `${+date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()} ${startTime} GMT${gmt}`
            let endFormat = `${+date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()} ${endTime} GMT${gmt}`
    
            let start = new Date(startFormat);
            let end = new Date(endFormat);
    
            if (start.toString().includes("Invalid") || end.toString().includes("Invalid")) 
                return interaction.reply('**Invalid time data. Users must set availability with `/setavailable start_time:10:30 end_time:18:00 gmt:+02:00 days:Mon,Tue,Wed`**');
    
            start = start.getTime().toString();
            end = end.getTime().toString();
    
            start = start.substring(0, start.length - 3);
            end = end.substring(0, end.length - 3);
    
            users.push(`<@!${ids[a]}> is available from <t:${start}:R> to <t:${end}:R> on these days: ${days}.`);



            }
            console.log(users)
            interaction.reply(`${users.join('\n')} `)
        }
    }
})

client.login(botToken).catch((err) => console.log('Bad token.'));
