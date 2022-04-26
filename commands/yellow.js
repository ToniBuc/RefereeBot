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
		.setName('yellow')
		.setDescription('Issues a yellow card to the specified user.')
        .addUserOption(option => option.setName('target').setDescription('Select a user')),
	async execute(interaction) {
		const user = interaction.options.getUser('target');
		var eu = await Users.findOne({ where: { userid: user.id}});

		if (eu){
			await Users.update({ yellowcards: sequelize.literal('yellowcards + 1')}, {where: { userid: user.id }});
			eu = await Users.findOne({ where: { userid: user.id}});
			if (eu.yellowcards % 2 === 0){
				await Users.update({ redcards: sequelize.literal('redcards + 1')}, {where: { userid: user.id }});
			}
		}
		else{
			try {
				await Users.create({
					userid: user.id,
					username: user.username,
					yellowcards: 1,
					redcards: 0
				});
			}
			catch (error) {
				if (error.name === 'SequelizeUniqueConstraintError') {
					return interaction.reply('That user already exists.');
				}
	
				return interaction.reply('Something went wrong with adding a user.');
			}
		}
		


		await interaction.reply("<@" + user + "> has been issued a yellow card! :yellow_square:");
	},
};