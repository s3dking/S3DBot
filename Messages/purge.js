module.exports = {
	permissions: 'ManageMessages',
	name: 'purge',
	description: 'Purge!',
	cooldown: 5,
	async execute(message, client, args) {

		const amount = parseInt(args[0]) + 1;
		if (isNaN(amount) || amount <= 0 || amount > 100) {
			return message.reply('Please provide a number between 1 and 100 for the number of messages to delete.');
		}

		try {
			const fetched = await message.channel.messages.fetch({ limit: amount });
			await message.channel.bulkDelete(fetched);
			message.channel.send(`Successfully deleted ${fetched.size} messages.`).then(msg => msg.delete({ timeout: 5000 }));
		} catch (error) {
			console.error(error);
			message.reply('There was an error trying to purge messages in this channel!');
		}
	}
};