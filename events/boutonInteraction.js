const Discord = require("discord.js")
const config = require("../config/config.json")

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {

    if (interaction.isButton()) {

      /*
*  *  *  *  *  *  *  *  *  *  *  *  *  *  
*  *  
*  *         Bouttons Anti bot
*  *  
*  *  *  *  *  *  *  *  *  *  *  *  *  *  
*/

      if (interaction.customId === `boutonVerification`) {

        const roleVerification = interaction.message.guild.roles.cache.get(config.roles.bienvenue);

        if (interaction.member.roles.cache.some(r => r.name.toLowerCase() === roleVerification.name.toLowerCase())) {

          return interaction.deferUpdate();
        }

        const verif = new Discord.MessageEmbed()
          .setDescription("Tu as bien été vérifié !")
          .setColor(config.embedColor)

        interaction.member.roles.add(roleVerification) && interaction.reply({ embeds: [verif], ephemeral: true })
      }
      /*
      *  *  *  *  *  *  *  *  *  *  *  *  *  *  
      *  *  
      *  *         Bouttons Tickets
      *  *  
      *  *  *  *  *  *  *  *  *  *  *  *  *  *  
      */

      /*
      *  *  *  *  *  *  *  *  *  *  *  *  *  *  
      *  *  
      *  *      Bouttons Sûr de fermer
      *  *  
      *  *  *  *  *  *  *  *  *  *  *  *  *  *  
      */
      else if (interaction.customId === "closed2") {
        const embed1 = new Discord.MessageEmbed()
          .setTitle("TICKET")
          .setDescription("Êtes vous sûr de vouloir fermer le ticket ?")
          .setColor(config.embedColor)
        const sur = new Discord.MessageActionRow()
          .addComponents(
            new Discord.MessageButton()
              .setCustomId('closed')
              .setLabel('Oui')
              .setEmoji('\u2714\ufe0f')
              .setStyle('PRIMARY'),

            new Discord.MessageButton()
              .setCustomId('nan')
              .setLabel('Non')
              .setEmoji("\u274c")
              .setStyle('DANGER'),
          )


        interaction.reply({ embeds: [embed1], components: [sur] })
      }

      /*
      *  *  *  *  *  *  *  *  *  *  *  *  *  *  
      *  *  
      *  *         Boutton non
      *  *  
      *  *  *  *  *  *  *  *  *  *  *  *  *  *  
      */

      else if (interaction.customId === "nan") {
        interaction.message.delete()
        const reste = new Discord.MessageEmbed()
          .setTitle("Le ticket reste ouvert !").setColor(config.embedColor)


        interaction.reply({ embeds: [reste], ephemeral: true })
      }

      /*
      *  *  *  *  *  *  *  *  *  *  *  *  *  *  
      *  *  
      *  *         Bouttons Fermer
      *  *  
      *  *  *  *  *  *  *  *  *  *  *  *  *  *  
      */

      else if (interaction.customId === "closed") {
        const log = new Discord.MessageEmbed()
          .setTitle('Ticket Ferm\u00e9')
          .setColor('#FF0000')
          .setDescription(`${interaction.member.user}` + " a ferm\u00e9 un ticket ! ( " + interaction.channel.name + " )")

        interaction.message.guild.channels.cache.get(config.channels.log).send({ embeds: [log] })

        const sum_messages = []
        let last_id = null
    
        while (true) {
            const messages = await interaction.channel.messages.fetch({ limit: 100, before: last_id })
            
            sum_messages.push(...Array.from(messages.map(e => {
              if(e.author.bot) {return {
                input: 'BOT MESSAGE',
                sender: "BOT",
                timestamp: e.createdTimestamp
              }  
            } else {

                return {
                  input: e.content,
                  sender: e.author.tag,
                  timestamp: e.createdTimestamp
                }
              }

 
            })));
            last_id = messages.last()?.id
        
            if (messages.size != 100) break
        }

        const sum_messages_a = [];
        let last_id_a = null;
    
        while (true) {
            const messages = await interaction.channel.messages.fetch({ limit: 100, before: last_id_a });
            sum_messages_a.push(...Array.from(messages.values()));
            last_id = messages.last()?.id;
        
            if (messages.size != 100) break;
        }

       let attch = new Discord.MessageAttachment(Buffer.from(`Tous les messages du ticket ${interaction.channel.name}\n\n` + sum_messages_a.map(m => `${new Date(m.createdAt).toLocaleString('fr-FR')} | ${m.author.tag} -> ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`).reverse().join('\n') + "\n\n----------------------------------------------"), `transcript_${interaction.channel.name}.txt`)

       let channel = interaction.message.guild.channels.cache.get(config.ticket.transcript)



        channel.send({
          content: `Tous les messages du ${interaction.channel.name}`,
          files: [attch]
        }).then(e => {
          const axiosConfig = {
            method: 'POST',
            url: 'https://botpanda.vercel.app/api/transcripts/',
            headers: { 
              'Content-Type': 'application/json',
            },
            data : {
              id: interaction.channel.id,
              data: {
                download: e.attachments.first().url,
                id: interaction.channel.id,
                channelName: interaction.channel.name,  
                messages: sum_messages
              },
              guild: "834522966732701706",
              guildName: "Serveur de test"        
            }
          };
  
      //    axios(axiosConfig)
          interaction.channel.delete()
        })
      
      }

      else {
        const db = require("./database.js").getDB()

        const idVerif = interaction.message.embeds[0].footer

        if (!idVerif) return
        if (!idVerif.text.includes("id:")) return

        const id = idVerif.text.replace("id: ", "")

        db.get(`SELECT * FROM ${id} WHERE id = ${interaction.user.id}`, (err, row) => {

          if (!row) {
            db.run(`INSERT INTO ${id} (id) VALUES ('${interaction.user.id}')`)

            const embedPRIMARY = new Discord.MessageEmbed()
              .setDescription("Vous avez bien été enregistré au giveaway !")
              .setColor(config.embedColor)

            interaction.reply({ embeds: [embedPRIMARY], ephemeral: true })
            db.all(`SELECT * FROM ${id}`, async (err, row) => {

              const buttons = new Discord.MessageActionRow()
                .addComponents(
                  new Discord.MessageButton()
                    .setCustomId(idVerif.text)
                    .setLabel('Participer au giveaway')
                    .setStyle('PRIMARY'),

                  new Discord.MessageButton()
                    .setCustomId("rien")
                    .setLabel('Participants: ' + row.length)
                    .setStyle('SECONDARY')
                    .setDisabled(true),
                )

              const messageGiveaway = await interaction.channel.messages.fetch(interaction.message.id)
              messageGiveaway.edit({ components: [buttons] })

            })

          } else {
            const embedAlready = new Discord.MessageEmbed()
              .setDescription("Vous êtes déjà enregistré au giveaway !")
              .setColor(config.embedColor)

            interaction.reply({ embeds: [embedAlready], ephemeral: true })
          }

        })
      }
    }

  }
}