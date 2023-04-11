const { SlashCommandBuilder, GuildMember } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('verify')
	    .setDescription('Verify yourself!'),
	async execute(interaction, hasRoles, client) {
        if (hasRoles) {
            await interaction.member.roles.add('1068173865957736549')
            interaction.reply("Verified " + interaction.member.user.username)
        }
	},
};