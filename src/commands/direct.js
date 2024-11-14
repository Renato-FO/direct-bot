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
            const members = await role.guild.members.fetch();
            const msg = interaction.options.getString('msg');
            console.log(role.members.size)
            // Função para adicionar delay
            function delay(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            // Listas para armazenar os resultados de envio
            const sentMembers = [];
            const failedMembers = [];

            if (role.members.size === 0) {
                return interaction.reply({
                    content: `⚠️ O cargo ${role.name} não possui membros para enviar a mensagem ⚠️`,
                    ephemeral: true
                });
            }

            async function sendMessagesWithDelay() {
                interaction.reply({
                    content: `${role.members.size} usuários encontrados, realizando envios...`,
                    ephemeral: true
                });
                for (const member of role.members.values()) {
                    try {
                        await member.send(msg);
                        sentMembers.push(`✅ ${member.user.tag}`);
                        console.log(`✅ ${member.user.tag}`)

                    } catch (error) {
                        failedMembers.push({ tag: member.user.tag, error: error.message }); // Armazena o erro
                        console.error(`Não foi possível enviar mensagem para ${member.user.tag}:`);

                    }
                    let successMessage = sentMembers.length > 0 ? `Enviados com sucesso:\n ${sentMembers.join("\n")}` : "Nenhuma mensagem foi enviada com sucesso.";
                    let failureMessage = failedMembers.length > 0
                        ? `❌ Falhas:\n${failedMembers.map(f => `${f.tag}: ${f.error}`).join("\n")}`
                        : "Nenhuma falha de envio.";
                    interaction.editReply({
                        content: `📊 Envios:\n\n${successMessage}\n\n${failureMessage}`,
                        ephemeral: true
                    });

                    // Delay de 5 segundos antes de enviar para o próximo membro
                    await delay(5000);
                }
            }

            // Chama a função de envio
            return new Promise((res, rej) => {
                res(sendMessagesWithDelay());
            })


        } catch (error) {
            console.error(error);
            interaction.reply({
                content: "⚠️ Ocorreu um erro ao tentar enviar as mensagens. Verifique o console para detalhes. ⚠️",
                ephemeral: true
            });
        }
    },
};
