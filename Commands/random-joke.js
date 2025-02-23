const { SlashCommandBuilder } = require('@discordjs/builders');
const { joke } = require('@s3dking/randomjoke')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('random-joke')
		.setDescription('Random Joke!')
		.addStringOption(option =>
			option.setName('category')
				.setDescription('Category of the joke')
				.setRequired(false)
				.addChoices(
					{ name: 'Dad Joke', value: 'dad' },
					{ name: 'Dark Humour Joke', value: 'dark' },
					{ name: 'Programming Joke', value: 'programming' },
					{ name: 'Pun Joke', value: 'pun' },
				)
			),
	execute: async function(interaction, client) {
		const category = interaction.options.getString('category') || 'dad';
		const jokes = joke.generate({
			type: category,
			jokes: 1
		})

		await interaction.reply({ content: jokes, ephemeral: true });
	}
}