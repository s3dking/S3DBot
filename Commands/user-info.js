const { createCanvas, loadImage } = require('canvas');
const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	aliases: ['who-is', 'member-info'],
	data: new SlashCommandBuilder()
		.setName('user-info')
		.setDescription('Get information about a user')
		.addUserOption(option => option.setName('user').setDescription('The user').setRequired(false)),
	execute: async function(interaction, client) {
		try {
			await interaction.deferReply();
			
			const user = interaction.options.getUser('user') || interaction.user;
			const member = await interaction.guild.members.fetch(user.id).catch(() => null);
			
			if (!member) {
				return interaction.editReply('Could not fetch member information.');
			}

			const roles = member.roles.cache
				.filter(role => role.id !== interaction.guild.id)
				.sort((a, b) => b.position - a.position)
				.map(role => role.toString());

			const dateCreated = user.createdAt.toDateString();
			const dateJoined = member.joinedAt.toDateString();
			const badges = user.flags?.toArray().map(flag => {
				return flag.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
			}).join(',\n') || 'None';
			const boosted = member.premiumSince ? member.premiumSince.toDateString() : 'Not boosting';

			const nickname = member.nickname || 'No Nickname';
			const status = 'Not Available';
			const activity = 'Not Available';
			const customStatus = 'Not Available';
			const platform = 'Not Available';
			
			const keyPermissions = member.permissions.toArray()
				.filter(perm => ['ADMINISTRATOR', 'MANAGE_GUILD', 'MANAGE_MESSAGES', 'MANAGE_ROLES', 'KICK_MEMBERS', 'BAN_MEMBERS']
				.includes(perm))
				.map(perm => perm.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()))
				.join(', ') || 'None';

			const accountAge = Math.floor((Date.now() - user.createdTimestamp) / (1000 * 60 * 60 * 24));
			const joinPosition = (await interaction.guild.members.fetch())
				.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
				.map(member => member.id)
				.indexOf(member.id) + 1;

			const canvas = createCanvas(700, 250);
			const ctx = canvas.getContext('2d');

			const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
			gradient.addColorStop(0, '#2C2F33');
			gradient.addColorStop(1, '#23272A');
			ctx.fillStyle = gradient;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			ctx.beginPath();
			ctx.moveTo(250, 0);
			ctx.lineTo(250, canvas.height);
			ctx.strokeStyle = '#7289DA';
			ctx.lineWidth = 2;
			ctx.stroke();

			ctx.save();
			ctx.beginPath();
			ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.clip();
			const avatar = await loadImage(user.displayAvatarURL({ 
				extension: 'png',
				size: 256
			}));
			ctx.drawImage(avatar, 25, 25, 200, 200);
			ctx.restore();

			ctx.font = 'bold 32px Arial';
			ctx.fillStyle = '#FFFFFF';
			ctx.fillText(user.username, canvas.width / 2.3, canvas.height / 3);

			ctx.font = '22px Arial';
			ctx.fillStyle = '#7289DA';
			ctx.fillText(`Joined: ${dateJoined}`, canvas.width / 2.3, canvas.height / 1.8);
			ctx.fillText(`Created: ${dateCreated}`, canvas.width / 2.3, canvas.height / 1.3);

			const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'user-info.png' });

			const embed = {
				title: `${user.username}'s Information`,
				image: { url: 'attachment://user-info.png' },
				color: 0x7289DA,
				fields: [
					{ 
						name: '🎭 Roles',
						value: roles.join(',\n') || 'None',
						inline: false
					},
					{
						name: '📛 Nickname',
						value: nickname,
						inline: true
					},
					{
						name: '🤖 Bot Account',
						value: user.bot ? 'Yes' : 'No',
						inline: true
					},
					{
						name: '📅 Member Since',
						value: `${dateJoined}\n(Join Position: #${joinPosition})`,
						inline: true
					},
					{
						name: '📆 Account Created',
						value: `${dateCreated}\n(${accountAge} days ago)`,
						inline: true
					},
					{
						name: '🎮 Activity',
						value: activity,
						inline: true
					},
					{
						name: '💭 Custom Status',
						value: customStatus,
						inline: true
					},
					{
						name: '🟢 Status',
						value: `${status} (on ${platform})`,
						inline: true
					},
					{
						name: '🏆 Badges',
						value: badges || 'None',
						inline: true
					},
					{
						name: '⭐ Booster Status',
						value: boosted,
						inline: true
					},
					{
						name: '🔑 Key Permissions',
						value: keyPermissions || 'None',
						inline: false
					}
				]
			};

			await interaction.editReply({ embeds: [embed], files: [attachment] });
		} catch (error) {
			console.error(error);
			return interaction.editReply({ content: 'There was an error while executing this command!' });
		}
	}
}