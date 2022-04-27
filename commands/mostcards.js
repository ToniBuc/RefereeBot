const { SlashCommandBuilder, channelMention } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
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
		.setName('mostcards')
		.setDescription('Retrieves the two users with the most cards issued respectively.'),
	async execute(interaction) {
        const maxyellow = await Users.findAll({ attributes: [[Sequelize.fn('max', Sequelize.col('yellowcards')), 'maxyellow']], raw: true });
        const maxred = await Users.findAll({ attributes: [[Sequelize.fn('max', Sequelize.col('redcards')), 'maxred']], raw: true});

        const yellowuser = await Users.findOne({ where: { yellowcards: maxyellow[0].maxyellow}});
        const reduser = await Users.findOne({ where: { redcards: maxred[0].maxred}});

        const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle("Users with most cards issued:")
        .addField(':yellow_square:', yellowuser.username + ": " + String(yellowuser.yellowcards), true)
        .addField(':red_square:', reduser.username + ": " + String(reduser.redcards), true);

        await interaction.reply({ embeds: [embed]});
	},
};