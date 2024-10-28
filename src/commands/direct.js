const Discord = require('discord.js');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('direct')
        .setDescription('Send direct messages to guild members')
        .addStringOption(option =>
            option.setName('msg')
                .setDescription("Mensagem que será enviada")
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Cargo que irá receber a DM')
                .setRequired(true)),

    async execute(interaction) {
        if (!interaction.member.permissions.has(Discord.PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply({
                content: "⚠️ Você não tem permissões para executar esse comando ⚠️",
                ephemeral: true
            });
        }

        try {
            const role = interaction.options.getRole('role');
            const msg = interaction.options.getString('msg');

            if (role.members.size === 0) {
                return interaction.reply({
                    content: `⚠️ O cargo ${role.name} não possui membros para enviar a mensagem ⚠️`,
                    ephemeral: true
                });
            }

            role.members.forEach(member => {
                console.log(Arr)
                Arr.forEach((item) => {
                    console.log(item)
                    console.log(member.user.tag)
                    member.send(msg).catch(error => {
                        console.error(`Não foi possível enviar mensagem para ${member.user.tag}:`, error);
                    });
                })
            });

            interaction.reply({
                content: `📤 Mensagem enviada para todos os membros do cargo ${role.name}.`,
                ephemeral: true
            });

        } catch (error) {
            console.error(error);
            interaction.reply({
                content: "⚠️ Ocorreu um erro ao tentar enviar as mensagens. Verifique o console para detalhes. ⚠️",
                ephemeral: true
            });
        }
    },
};
