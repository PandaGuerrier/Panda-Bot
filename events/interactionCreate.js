module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (interaction.isCommand()) {
      const command = interaction.client.commands.get(interaction.commandName)
      if (!command) return
      await command.execute(interaction)
    }
  }
}