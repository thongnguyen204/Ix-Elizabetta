import messages from "@/constants/messages";
import { QueueItem, Server } from "@/models/Server";
import { servers } from "@/servers";
import { YoutubeService } from "@/services/youtube";
import { Platform } from "@/types/Song";
import { 
    entersState,
    joinVoiceChannel,
    VoiceConnectionStatus,
} from "@discordjs/voice";
import { CommandInteraction, GuildMember } from "discord.js";
import { createPlayMessage } from "../messages/playMessage";

export const play = {
    name: 'play',
    execute: async (interaction: CommandInteraction): Promise<void> => {
        await interaction.deferReply();
        let server = servers.get(interaction.guildId as string);
        if (!server) {
            if (
                interaction.member instanceof GuildMember &&
                interaction.member.voice.channel
            ) {
                const channel = interaction.member.voice.channel;
                server = new Server(
                    joinVoiceChannel({
                        channelId: channel.id,
                        guildId: channel.guild.id,
                        adapterCreator: channel.guild.voiceAdapterCreator,
                    }),
                    interaction.guildId as string,
                );
                servers.set(interaction.guildId as string, server);
            }
        }

        if (!server) {
            await interaction.followUp(messages.joinVoiceChannel);
            return;
        }
        // Make sure the connection is ready before process user's request
        try {
            await entersState(
                server.voiceConnection,
                VoiceConnectionStatus.Ready,
                20e3,
            );
        } catch (error) {
            await interaction.followUp(messages.failToJoinVoiceChannel);
            return;
        }
        try {
            const input = interaction.options.get('song')!.value! as string;
            const playlistId = YoutubeService.isPlaylist(input);
            if (playlistId) {
                const playlist = await YoutubeService.getPlaylist(playlistId);
                const songs = playlist.songs.map((song) => {
                    const queueItem: QueueItem = {
                        song,
                        requester: interaction.member?.user.username as string,
                    };
                    return queueItem;
                });
                await server.addSongs(songs);
                interaction.followUp({
                    embeds: [
                        createPlayMessage({
                            title: playlist.title,
                            url: input,
                            author: playlist.author,
                            thumbnail: playlist.thumbnail,
                            type: 'Playlist',
                            length: playlist.songs.length,
                            platform: Platform.YOUTUBE,
                            requester: interaction.member?.user.username as string,
                        }),
                    ],
                });
            } else {
                const song = await YoutubeService.getVideoDetails(input);
                const queueItem: QueueItem = {
                    song,
                    requester: interaction.member?.user.username as string,
                };
                await server.addSongs([queueItem]);
                interaction.followUp({
                    embeds: [
                        createPlayMessage({
                            title: song.title,
                            url: song.url,
                            author: song.author,
                            thumbnail:song.thumbnail,
                            type: 'Song',
                            length: song.length,
                            platform: Platform.YOUTUBE,
                            requester: interaction.member?.user.username as string,
                        }),
                    ],
                });
            }
        } catch (error) {
            await interaction.followUp(messages.failToPlay + ' ' + error);
        }
    },
};