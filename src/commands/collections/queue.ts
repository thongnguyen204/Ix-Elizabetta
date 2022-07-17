import messages from '@/constants/messages';
import { servers } from '@/servers';
import { AudioPlayerStatus } from '@discordjs/voice';
import { CommandInteraction, MessageActionRow, MessageButton, TextChannel } from 'discord.js';
import { createQueueMessages } from '../messages/queueMessage';

export const queue = {
  name: 'queue',
  execute: async (interaction: CommandInteraction): Promise<void> => {
    await interaction.deferReply();
    const server = servers.get(interaction.guildId as string);
    if (!server) {
      await interaction.followUp(messages.joinVoiceChannel);
      return;
    }
    if (server.queue.length === 0) {
      await interaction.followUp(messages.nothing);
      return;
    }

    const embedMessages = createQueueMessages(server.queue);
    await interaction.editReply(messages.yourQueue);

    if (
      interaction &&
      interaction.channel &&
      interaction.channel instanceof TextChannel
    ) {
      const buttonRow = new MessageActionRow()
      .addComponents([
          getPauseResumeButton(interaction),
          new MessageButton()
          .setCustomId('skip')
          .setLabel('>>')
          .setStyle('PRIMARY'),
        ]);

        await interaction.channel.send({
          embeds: embedMessages,
          components: [
            buttonRow,
          ],
        });
    }
  },
};

function getPauseResumeButton(interaction: CommandInteraction): MessageButton {
  const server = servers.get(interaction.guildId as string);
  if (server?.audioPlayer.state.status === AudioPlayerStatus.Paused) {
      return new MessageButton()
        .setCustomId('resume')
        .setLabel('▶')
        .setStyle('SUCCESS');
  }
  return new MessageButton()
  .setCustomId('pause')
  .setLabel('||')
  .setStyle('DANGER');
}