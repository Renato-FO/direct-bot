const { Client, GatewayIntentBits, Collection } = require('discord.js')
const dotenv = require('dotenv')
const fs = require('fs')
const path = require('path')

dotenv.config()
const token = process.env.TOKEN

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent
    ]
})

client.commands = new Collection()

const commandsPath = path.join(__dirname, 'src/commands')
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file)
    const command = require(filePath)
    client.commands.set(command.data.name, command)
}

client.once('ready', () => {
    console.log('Bot online 🔥')
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return

    const command = client.commands.get(interaction.commandName)
    if (!command) return

    try {
        await command.execute(interaction)
    } catch (error) {
        console.error(error)
        await interaction.reply({ content: "Aconteceu um erro ao executar o comando", ephemeral: true })
    }
})

client.login(token)