const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('autoresponder')
    .setDescription('Autoresponder')
    .addSubcommand(subcommand =>
        subcommand
        .setName('add')
        .setDescription('Add a new autoresponder')
        .addStringOption(option =>
            option.setName('trigger')
            .setDescription('The trigger word')
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('response')
            .setDescription('The response')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
        subcommand
        .setName('remove')
        .setDescription('Remove an autoresponder')
        .addStringOption(option =>
            option.setName('trigger')
            .setDescription('The trigger word')
            .setRequired(true)
        )
    ),
    async execute(interaction, client) {

        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case 'add':
                const trigger = interaction.options.getString('trigger');
                const response = interaction.options.getString('response');

                try {
                    await client.db.prepare('INSERT INTO autoresponder (guild_id, trigger, response) VALUES (?, ?, ?)').run(interaction.guild.id, trigger, response);
                    await interaction.reply({ content: `Added autoresponder: "${trigger}" → "${response}"`, ephemeral: true });
                } catch (error) {
                    if (error.code === 'SQLITE_CONSTRAINT') {
                        await interaction.reply({ 
                            content: 'That trigger already exists in this server! Remove it first if you want to change it.',
                            ephemeral: true 
                        });
                    } else {
                        throw error;
                    }
                }
                break;

            case 'remove':
                const triggerToRemove = interaction.options.getString('trigger');
                const result = await client.db.prepare('DELETE FROM autoresponder WHERE guild_id = ? AND trigger = ?').run(interaction.guild.id, triggerToRemove);
                
                if (result.changes > 0) {
                    await interaction.reply({ 
                        content: `Removed autoresponder with trigger: "${triggerToRemove}"`,
                        ephemeral: true 
                    });
                } else {
                    await interaction.reply({ 
                        content: 'No autoresponder found with that trigger in this server!',
                        ephemeral: true 
                    });
                }
                break;
        }
    }
};