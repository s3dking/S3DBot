module.exports = {
    name: 'messageCreate',
    async execute(client, message) {
        if (!message.guild) return;
        
        const response = await client.db.prepare('SELECT response FROM autoresponder WHERE guild_id = ? AND trigger = ?').get(message.guild.id, message.content);
        if (response) {
            message.reply(response.response);
        }
    }
};