import messages from "@/constants/messages";
import { servers } from "@/servers";
import { ButtonInteraction, CommandInteraction } from "discord.js";

export const skipButton = {
    name: 'skip',
    execute: async (interation: ButtonInteraction): Promise<void> => {
        const server = servers.get(interation.guildId as string);
        if (!server) {
            await interation.reply(messages.joinVoiceChannel);
            return;
        }
        if (server.queue.length === 0) {
            await interation.reply(messages.noSongsInQueue);
        }
        await server.play();
        if (server.playing) {
            await interation.reply(messages.skippedSong);
        }
    },
};