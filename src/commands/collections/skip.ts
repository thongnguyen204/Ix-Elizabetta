import messages from "@/constants/messages";
import { servers } from "@/servers";
import { CommandInteraction } from "discord.js";

export const skip = {
    name: 'skip',
    execute: async (interation: CommandInteraction): Promise<void> => {
        await interation.deferReply();
        const server = servers.get(interation.guildId as string);
        if (!server) {
            await interation.followUp(messages.joinVoiceChannel);
            return;
        }
        if (server.queue.length === 0) {
            await interation.followUp(messages.noSongsInQueue);
        }
        await server.play();
        if (server.playing) {
            await interation.followUp(messages.skippedSong);
        }
    },
};