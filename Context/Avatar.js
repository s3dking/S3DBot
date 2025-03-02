const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Avatar')
        .setType(ApplicationCommandType.User),
    async execute(interaction, client) {
        const user = interaction.targetUser;
        
        if (user.avatar?.startsWith('a_')) {
            return interaction.reply({ 
                content: 'You cannot receive the avatar of this user because they have an animated avatar.',
                ephemeral: true 
            });
        }

        const avatar = user.displayAvatarURL({ size: 4096, format: 'png' });
        const embed = {
            color: 0x00ff00,
            description: `## [${user.tag}'s Avatar](${avatar})`,
            image: { url: avatar },
            timestamp: new Date().toISOString()
        };

        await interaction.reply({ embeds: [embed] });
    }
};