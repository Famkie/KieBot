export default {
  customId: 'feedbackModal',
  async execute(interaction) {
    const feedback = interaction.fields.getTextInputValue('feedbackInput');

    await interaction.reply({
      content: `Terima kasih atas feedback-nya: ${feedback}`,
      ephemeral: true,
    });
  }
};
