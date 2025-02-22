module.exports = {
	name: 'uptime',
	description: 'uptime!',
	async execute(message, client, args) {
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

		if (args[0]) return message.reply({ content: 'This command does not take any arguments!', ephemeral: true });
		await message.reply({ embeds: [embed] });
	}
};