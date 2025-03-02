const { SlashCommandBuilder } = require('discord.js')
const { math } = require('simple-equations')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('math')
        .setDescription('Solve a simple equation')
        .addStringOption(option => option.setName('operation').setDescription('The operation to use').setChoices(
            { name: 'Addition', value: 'add' },
            { name: 'Subtraction', value: 'subtract' },
            { name: 'Multiplication', value: 'multiply' },
            { name: 'Division', value: 'divide' },
        ).setRequired(true))
        .addStringOption(option => option.setName('numbers').setDescription('The numbers to use ( SEPERATE BY COMMAS )').setRequired(true)),
    async execute(interaction, client) {
        try {
            await interaction.deferReply().catch((err) => console.error(err));

            const operation = interaction.options.getString('operation');
            const numbers = interaction.options.getString('numbers').split(',').map(Number);

            if (numbers.some(isNaN)) {
                return interaction.editReply('One or more of the numbers provided are not valid.');
            }

            let result;
            if (operation === 'add') {
                result = math.add(...numbers);
            }
            if (operation === 'subtract') {
                result = math.subtract(...numbers);
            }
            if (operation === 'multiply') {
                result = math.multiply(...numbers);
            }
            if (operation === 'divide') {
                result = math.divide(...numbers);
            }

            await interaction.editReply(`The result of the operation is: ${result}`);
            console.log(`✅result: ${result}`);
        } catch (err) {
            console.error(err);
            interaction.editReply('There was an error while executing this command!');
        }
    }
}