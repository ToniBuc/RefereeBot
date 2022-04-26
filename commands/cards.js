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
		.setName('cards')
		.setDescription('Retrieves the number of cards that were issued to the specified user.')
        .addUserOption(option => option.setName('target').setDescription('Select a user')),
	async execute(interaction) {
        const user = interaction.options.getUser('target');
        const eu = await Users.findOne({ where: { userid: user.id}});


        if (eu){
            const embed = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle(eu.username + "'s cards:")
            .addField(':yellow_square:', String(eu.yellowcards), true)
            .addField(':red_square:', String(eu.redcards), true);

            await interaction.channel.send({ embeds: [embed]});
        }
        else {
            await interaction.reply(user.username + " has not been issued any cards yet!");
        }
	},
};