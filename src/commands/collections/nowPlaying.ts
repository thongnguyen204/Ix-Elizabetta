import messages from "@/constants/messages";
import { servers } from "@/servers";
import { CommandInteraction } from "discord.js";
import { createNowPlayingMessage } from "../messages/nowPlayingMessage";

export const nowPlaying = {
    name: 'nowplaying',
    execute: async (interation: CommandInteraction): Promise<void> => {
        await interation.deferReply();
        const server = servers.get(interation.guildId as string);
        if (!server) {
            await interation.followUp(messages.joinVoiceChannel);
            return;
        }
        if (!server.playing) {
            await interation.followUp(messages.notPlaying);
            return;
        }
        const playing = server.playing;
        const message = createNowPlayingMessage({
            title: playing.song.title,
            author: playing.song.author,
            thumbnail: playing.song.thumbnail,
            url: playing.song.url,
            length: playing.song.length,
            platform: playing.song.platform,
            requester: playing.requester,
        });
        await interation.followUp({
            embeds: [message],
        });
    },
};