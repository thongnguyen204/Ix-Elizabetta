import messages from "@/constants/messages";
import { servers } from "@/servers";
import { AudioPlayerStatus } from "@discordjs/voice";
import { ButtonInteraction, CommandInteraction } from "discord.js";

export const pauseButton = {
    name: 'pause',
    execute: async (interaction: ButtonInteraction): Promise<void> => {
        const server = servers.get(interaction.guildId as string);
        if (!server) {
            await interaction.reply(messages.joinVoiceChannel);
            return;
        }
        if (server.audioPlayer.state.status === AudioPlayerStatus.Playing) {
            server.audioPlayer.pause();
            await interaction.reply(messages.paused);
            return;
        }
        await interaction.reply(messages.notPlaying);
    },
};