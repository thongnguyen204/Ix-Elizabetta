import messages from "@/constants/messages";
import { servers } from "@/servers";
import { AudioPlayerStatus } from "@discordjs/voice";
import { ButtonInteraction, CommandInteraction } from "discord.js";

export const resumeButton = {
    name: 'resume',
    execute: async (interation: ButtonInteraction): Promise<void> => {
        const server = servers.get(interation.guildId as string);
        if (!server) {
            await interation.reply(messages.joinVoiceChannel);
            return;
        }
        if (server.audioPlayer.state.status === AudioPlayerStatus.Paused) {
            server.audioPlayer.unpause();
            await interation.reply(messages.resumed);
            return;
        }
        await interation.reply(messages.notPlaying);
    },
};