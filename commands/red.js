const { SlashCommandBuilder } = require('@discordjs/builders');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite'
});

const Users = require("../database/Users")(sequelize);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('red')
		.setDescription('Issues a red card to the specified user.')
        .addUserOption(option => option.setName('target').setDescription('Select a user')),
	async execute(interaction) {
		const user = interaction.options.getUser('target');
        const eu = await Users.findOne({ where: { userid: user.id}});

        if (eu){
			await Users.update({ redcards: sequelize.literal('redcards + 1')}, {where: { userid: user.id }});
		}
		else{
			try {
				await Users.create({
					userid: user.id,
					username: user.username,
					yellowcards: 0,
					redcards: 1
				});
			}
			catch (error) {
				if (error.name === 'SequelizeUniqueConstraintError') {
					return interaction.reply('That user already exists.');
				}
	
				return interaction.reply('Something went wrong with adding a user.');
			}
		}

		await interaction.reply("<@" + user + "> has been issued a red card! :red_square:");
	},
};