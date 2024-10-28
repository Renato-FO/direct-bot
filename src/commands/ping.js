const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with the bots ping'),
    async execute(interaction) {
        const sent = await interaction.reply({ content: "Ping!", fetchReply: true })
        interaction.editReply(`Seu ping é: ${sent.createdTimestamp - interaction.createdTimestamp}ms. Ping da API: ${Math.round(interaction.client.ws.ping)}ms`)
    },
}