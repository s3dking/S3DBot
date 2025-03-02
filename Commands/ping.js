const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Receive the latency of the bot!'),
    execute: async function(interaction, client) {
        await interaction.deferReply();
        
        const sent = await interaction.fetchReply();
        const ping = sent.createdTimestamp - interaction.createdTimestamp;
        const websockets = client.ws.ping;

        const embed = {
            color: 0x00ff00,
            title: '🏓 Pong!',
            fields: [
                { name: 'Message Latency', value: `${ping}ms`, inline: true },
                { name: 'WebSocket Latency', value: `${websockets}ms`, inline: true }
            ],
            timestamp: new Date().toISOString()
        };

        await interaction.editReply({ embeds: [embed] });
    }
}