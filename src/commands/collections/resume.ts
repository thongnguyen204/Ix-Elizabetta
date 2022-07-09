import messages from "@/constants/messages";
import { servers } from "@/servers";
import { AudioPlayerStatus } from "@discordjs/voice";
import { CommandInteraction } from "discord.js";

export const resume = {
    name: 'resume',
    execute: async (interation: CommandInteraction): Promise<void> => {
        await interation.deferReply();
        const server = servers.get(interation.guildId as string);
        if (!server) {
            await interation.followUp(messages.joinVoiceChannel);
            return;
        }
        if (server.audioPlayer.state.status === AudioPlayerStatus.Paused) {
            server.audioPlayer.unpause();
            await interation.followUp(messages.resumed);
            return;
        }
        await interation.followUp(messages.notPlaying);
    },
};