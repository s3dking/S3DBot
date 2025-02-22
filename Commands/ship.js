const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { ApexPainter } = require("apexify.js");

const Image = new ApexPainter({ type: 'buffer' });

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ship')
        .setDescription('Ship two users together!')
        .addUserOption(option =>
            option.setName('user1')
                .setDescription('First user to ship')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('user2')
                .setDescription('Second user to ship')
                .setRequired(true)),

    async execute(interaction) {
        const user1 = interaction.options.getUser('user1');
        const user2 = interaction.options.getUser('user2');
        const similarity = calculateSimilarity(user1.username, user2.username);

        try {
            const avatar1URL = user1.displayAvatarURL({ format: 'png', dynamic: true, size: 512 });
            const avatar2URL = user2.displayAvatarURL({ format: 'png', dynamic: true, size: 512 });

            // 🎨 **Create Background**
            const bg = (await Image.createCanvas({
                gradientBg: {
                    type: 'radial',
                    startRadius: 0, 
                    endRadius: 450,
                    startX: 450,
                    startY: 225,
                    endX: 450,
                    endY: 225,
                    colors: [
                        { stop: 0, color: "#ff4f78" }, 
                        { stop: 0.5, color: "#b852ff" },
                        { stop: 1, color: "#3f51b5" }
                    ]
                },
                width: 900, height: 450,
                borderRadius: 50,
            })).buffer;
            
            // 🎭 **Ship Image Components**
            const imgs = [
                {
                    source: 'square',
                    x: 50,
                    y: 50,
                    isFilled: true,
                    color: "black",
                    opacity: 0.3,
                    blur: 30,
                    width: 800,
                    height: 350,
                    borderRadius: 20,
                },
                {
                    source: 'heart',
                    x: 350,
                    y: 130,
                    isFilled: true,
                    width: 200,
                    height: 200,
                    gradient: {
                        type: "linear",
                        colors: [
                            { stop: 0, color: "#ff3b6e" },  
                            { stop: 0.5, color: "#ff7eb3" }, 
                            { stop: 1, color: "#b852ff" }
                        ]
                    },
                    filling: { percentage: similarity }, // Dynamic filling %
                    stroke: {
                        width: 3,
                        gradient: {
                            type: "linear",
                            colors: [
                                { stop: 0, color: "#d55eff" }, 
                                { stop: 0.5, color: "#5a9eff" }, 
                                { stop: 1, color: "#ff3b6e" }
                            ]
                        }
                    },
                    shadow: {
                        blur: 40,
                        opacity: 0.8,
                        gradient: {
                            type: "radial",
                            startX: 450, 
                            startY: 230, 
                            startRadius: 0, 
                            endX: 450, 
                            endY: 230, 
                            endRadius: 140,
                            colors: [
                                { stop: 0, color: "#ff007f" },  
                                { stop: 1, color: "#8000ff" }
                            ]
                        },
                        offsetX: 0,
                        offsetY: 5
                    }
                },
                {
                    source: avatar1URL,
                    x: 120,
                    y: 135,
                    width: 180,
                    height: 180,
                    borderRadius: 'circular',
                    stroke: {
                        width: 4,
                        borderRadius: 'circular',
                        gradient: {
                            type: "linear",
                            colors: [
                                { stop: 0, color: "#ff4f78" },
                                { stop: 1, color: "#b852ff" }
                            ]
                        }
                    },
                    shadow: {
                        blur: 30,
                        opacity: 0.7,
                        gradient: {
                            type: "radial",
                            startX: 210, 
                            startY: 225, 
                            startRadius: 0, 
                            endX: 210, 
                            endY: 225, 
                            endRadius: 110,
                            colors: [
                                { stop: 0, color: "#007bff" },  
                                { stop: 1, color: "#00ffff" }
                            ]
                        },
                        offsetX: 0,
                        offsetY: 5
                    }
                },
                {
                    source: avatar2URL,
                    x: 610,
                    y: 135,
                    width: 180,
                    height: 180,
                    borderRadius: 'circular',
                    stroke: {
                        width: 4,
                        borderRadius: 'circular',
                        gradient: {
                            type: "linear",
                            colors: [
                                { stop: 0, color: "#5a9eff" },
                                { stop: 1, color: "#ff3b6e" }
                            ]
                        }
                    },
                    shadow: {
                        blur: 30,
                        opacity: 0.7,
                        gradient: {
                            type: "radial",
                            startX: 700, 
                            startY: 225, 
                            startRadius: 0, 
                            endX: 700, 
                            endY: 225, 
                            endRadius: 110,
                            colors: [
                                { stop: 0, color: "#ff0000" },  
                                { stop: 1, color: "#ff7300" }
                            ]
                        },
                        offsetX: 0,
                        offsetY: 5
                    }
                }
            ];
            
            const img = await Image.createImage(imgs, bg);

            // 🎭 **Text for Match Percentage**
            const txts = [
                {
                    text: `${similarity}%`,
                    fontName: "Montserrat Black",
                    fontSize: 55,
                    x: 420,
                    y: 240,
                    gradient: {
                        type: "linear",
                        colors: [
                            { stop: 0, color: "#ff007f" },
                            { stop: 0.5, color: "#ffcc33" },
                            { stop: 1, color: "#b852ff" }
                        ]
                    },
                    stroke: {
                        width: 4,
                        gradient: {
                            type: "linear",
                            colors: [
                                { stop: 0, color: "#8a2be2" },
                                { stop: 1, color: "#5a9eff" }
                            ]
                        }
                    }
                }
            ];

            const finalImage = await Image.createText(txts, img);

            const attachment = new AttachmentBuilder(finalImage, { name: 'ship.png' });
            const embed = new EmbedBuilder()
                .setTitle('❤️ Love Calculator ❤️')
                .setDescription(`${user1} + ${user2} = **${similarity}%** compatible!`)
                .setImage('attachment://ship.png')
                .setColor(getColorFromPercentage(similarity));

            await interaction.reply({ embeds: [embed], files: [attachment] });
        } catch (error) {
            console.error('Error loading avatars:', error);
        }
    }
};
