const fs = require('node:fs');
const Sequelize = require('sequelize');
const { Client, Collection, Intents, User } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite'
});

const Users = require("./database/Users")(sequelize);

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require('./commands/' + file);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
    Users.sync();

	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) 
        return;

	const command = client.commands.get(interaction.commandName);

    if (!command)
        return;
    
    try {
        await command.execute(interaction);
    } catch(error){
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true});
    }
});

client.login(token);