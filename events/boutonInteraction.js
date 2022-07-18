const { MessageEmbed, MessageActionRow, MessageButton, MessageAttachment } = require("discord.js");
const config = require("../config/config.json")

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {

    if (interaction.isButton()) {

      if (interaction.customId === `boutonVerification`) {

        const roleVerification = interaction.message.guild.roles.cache.get(config.roles.bienvenue);

        if (interaction.member.roles.cache.some(r => r.name.toLowerCase() === roleVerification.name.toLowerCase())) {
          return await interaction.deferUpdate();
        }

        const verif = new MessageEmbed()
          .setDescription("Tu as bien été vérifié !")
          .setColor(config.embedColor)

        await interaction.member.roles.add(roleVerification) && await interaction.reply({ embeds: [verif], ephemeral: true })

      } else if (interaction.customId === "closed2") {

        const embed1 = new MessageEmbed()
          .setTitle("TICKET")
          .setDescription("Êtes vous sûr de vouloir fermer le ticket ?").setColor(config.embedColor)

        const sur = new MessageActionRow()
          .addComponents(
            new MessageButton()
              .setCustomId('closed')
              .setLabel('Oui')
              .setEmoji('\u2714\ufe0f')
              .setStyle('PRIMARY'),
            new MessageButton()
              .setCustomId('nan')
              .setLabel('Non')
              .setEmoji("\u274c")
              .setStyle('DANGER'),
          )

        await interaction.reply({ embeds: [embed1], components: [sur] })

      } else if (interaction.customId === "nan") {
        await interaction.message.delete()

        const reste = new MessageEmbed()
          .setTitle("Le ticket reste ouvert !").setColor(config.embedColor)

        await interaction.reply({ embeds: [reste], ephemeral: true })
        
      } else if (interaction.customId === "closed") {

        const log = new MessageEmbed()
          .setTitle('Ticket Ferm\u00e9')
          .setDescription(`${interaction.member.user}` + " a ferm\u00e9 un ticket ! ( " + interaction.channel.name + " )").setColor('#FF0000')

        await interaction.message.guild.channels.cache.get(config.channels.log).send({ embeds: [log] })

				const sum_messages = [];
				let last_id = null;
				let size100 = false

				do {
					const messages = await interaction.channel.messages.fetch({ limit: 100, before: last_id });

					sum_messages.push(...Array.from(messages.values()));
					last_id = messages.last()?.id;

					if(messages.size != 100) size100 = false

				} while (size100);

        let attch = new MessageAttachment(Buffer.from(`Tous les messages du ticket ${interaction.channel.name}\n\n` + sum_messages.map(m => `${new Date(m.createdAt).toLocaleString('fr-FR')} | ${m.author.tag} -> ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`).reverse().join('\n') + "\n\n----------------------------------------------"), `transcript_${interaction.channel.name}.txt`)

        let channel = interaction.message.guild.channels.cache.get(config.tickets.transcript)

        await channel.send({content: `Tous les messages du ${interaction.channel.name}`, files: [attch]})

        await interaction.channel.delete()
      } else if (interaction.customId.startsWith("giveaway:")) {

        const id = interaction.customId.replace("giveaway:", "")

        const isGiveawayExist = await interaction.client.db.models.Giveaway.findOne({
          where: {
            id: id
          }
        })

        if (!isGiveawayExist) return await interaction.reply({ content: "Désolé, ce giveaway n'a jamais existé ou a été supprimé." })

        const userGiveaway = isGiveawayExist.dataValues.users.some(u => u == interaction.member.user.id)

        if (!userGiveaway) {
          await interaction.client.db.models.Giveaway.update({
            users: [...isGiveawayExist.dataValues.users, interaction.member.user.id]
          },
            { where: { id: id } })

          const embedPRIMARY = new MessageEmbed()
            .setDescription("Vous avez bien été enregistré au giveaway !").setColor(config.embedColor)

          await interaction.reply({ embeds: [embedPRIMARY], ephemeral: true })

          const buttons = new MessageActionRow()
            .addComponents(
              new MessageButton()
                .setCustomId(interaction.customId)
                .setLabel('Participer au giveaway')
                .setStyle('PRIMARY'),
              new MessageButton()
                .setCustomId("rien")
                .setLabel(`Participants: ${parseInt(isGiveawayExist.dataValues.users.length) + 1}`)
                .setStyle('SECONDARY')
                .setDisabled(true),
            )

          const messageGiveaway = await interaction.channel.messages.fetch(interaction.message.id)
          await messageGiveaway.edit({ components: [buttons] })
        } else {

          const embedAlready = new MessageEmbed()
            .setDescription("Vous êtes déjà enregistré au giveaway !").setColor(config.embedColor)

          await interaction.reply({ embeds: [embedAlready], ephemeral: true })
        }
      }
    }

  }
}