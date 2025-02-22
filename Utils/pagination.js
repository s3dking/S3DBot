const createPagination = async (interaction, pages, timeout = 60000) => {
    let currentPage = 0;
    
    // Defer the reply first
    await interaction.deferReply();
    
    const buttons = {
        type: 1,
        components: [
            {
                type: 2,
                emoji: '⬅️',
                custom_id: 'prev',
                style: 1,
                disabled: true
            },
            {
                type: 2,
                emoji: '➡️',
                custom_id: 'next',
                style: 1,
                disabled: pages.length <= 1
            }
        ]
    };

    const message = await interaction.editReply({
        embeds: [pages[0]],
        components: [buttons],
        fetchReply: true
    });

    const collector = message.createMessageComponentCollector({
        time: timeout,
        filter: (i) => i.user.id === interaction.user.id
    });

    collector.on('collect', async (i) => {
        try {
            await i.deferUpdate();
            
            currentPage = i.customId === 'prev' ? currentPage - 1 : currentPage + 1;
            buttons.components[0].disabled = currentPage === 0;
            buttons.components[1].disabled = currentPage === pages.length - 1;

            await i.editReply({
                embeds: [pages[currentPage]],
                components: [buttons]
            });
        } catch (error) {
            console.error('Pagination error:', error);
        }
    });

    collector.on('end', async () => {
        try {
            buttons.components.forEach(button => button.disabled = true);
            await interaction.editReply({ components: [buttons] });
        } catch (error) {
            console.error('Pagination end error:', error);
        }
    });
};

module.exports = { createPagination };
