const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	alias: ['up', 'ut'],
	data: new SlashCommandBuilder()
		.setName('uptime')
		.setDescription('Get the uptime of the bot'),
	execute: async function(interaction, client) {
		const uptime = client.uptime;
		const seconds = Math.floor((uptime / 1000) % 60);
		const minutes = Math.floor((uptime / (1000 * 60)) % 60);
		const hours = Math.floor((uptime / (1000 * 60 * 60)) % 24);
		const days = Math.floor(uptime / (1000 * 60 * 60 * 24));

		let uptimeString = '';
		if (days > 0) uptimeString += `${days} day(s) `;
		if (hours > 0) uptimeString += `${hours} hour(s) `;
		if (minutes > 0) uptimeString += `${minutes} minute(s) `;
		if (seconds > 0) uptimeString += `${seconds} second(s)`;

		const embed = {
			color: 0x0099ff,
			title: 'Bot Uptime',
			description: `The bot has been up for: ${uptimeString}`,
			timestamp: new Date(),
			footer: {
				text: 'Uptime Information',
				icon_url: client.user.displayAvatarURL()
			}
		};

		await interaction.reply({ embeds: [embed] });
	}
}