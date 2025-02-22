const { SlashCommandBuilder } = require('@discordjs/builders');
const { createPagination } = require('../Utils/pagination');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Help!'),
    execute: async function(interaction, client) {
        const commandsPerPage = 5;
        const commands = Array.from(client.commands.entries()).map(([name, cmd]) => ({
            name: name,
            description: cmd.data.description || 'No description available'
        }));

        // If no commands, send a simple message
        if (commands.length === 0) {
            return interaction.reply({
                embeds: [{
                    color: 0x0099ff,
                    title: 'Help Menu',
                    description: 'No commands available.',
                    timestamp: new Date()
                }]
            });
        }

        const pages = [];
        for (let i = 0; i < commands.length; i += commandsPerPage) {
            const currentCommands = commands.slice(i, i + commandsPerPage);
            const commandList = currentCommands.map(cmd => 
                `**/${cmd.name}**\n${cmd.description}`).join('\n\n');
                
            pages.push({
                color: 0x0099ff,
                title: 'Help Menu',
                description: commandList || 'No commands on this page.',
                footer: {
                    text: `Page ${pages.length + 1}/${Math.ceil(commands.length / commandsPerPage)}`,
                    icon_url: client.user.displayAvatarURL()
                },
                timestamp: new Date()
            });
        }

        if (pages.length > 0) {
            await createPagination(interaction, pages);
        } else {
            await interaction.reply({
                embeds: [{
                    color: 0x0099ff,
                    title: 'Help Menu',
                    description: 'No commands available.',
                    timestamp: new Date()
                }]
            });
        }
    }
};