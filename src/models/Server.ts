import { Platform, Song } from "@/types/Song";
import { servers } from '@/servers';
import { 
    AudioPlayer,
    AudioPlayerStatus,
    createAudioPlayer,
    createAudioResource,
    entersState,
    VoiceConnection,
    VoiceConnectionDisconnectReason,
    VoiceConnectionStatus,
} from "@discordjs/voice";
import { SoundCloud } from "scdl-core";
import ytdl from "ytdl-core";

export interface QueueItem {
    song: Song;
    requester: string;
}

export class Server {
    public guildId: string;
    public playing?: QueueItem;
    public queue: QueueItem[];
    public readonly voiceConnection: VoiceConnection;
    public readonly audioPlayer: AudioPlayer;
    private isReady = false;

    constructor(voiceConnection: VoiceConnection, guildId: string) {
        this.voiceConnection = voiceConnection;
        this.audioPlayer = createAudioPlayer();
        this.queue = [];
        this.playing = undefined;
        this.guildId = guildId;

        this.voiceConnection.on<"stateChange">('stateChange', async (_, newState) => {
            if (newState.status === VoiceConnectionStatus.Disconnected) {
                if (
                    newState.reason === VoiceConnectionDisconnectReason.WebSocketClose &&
                    newState.closeCode === 4014
                ) {
                    try {
                        await entersState(
                            this.voiceConnection,
                            VoiceConnectionStatus.Connecting,
                            5_000,
                        );
                    } catch (e) {
                        this.leave();
                    }
                } else if (this.voiceConnection.rejoinAttempts < 5) {
                    this.voiceConnection.rejoin();
                } else {
                    this.leave();
                }
            } else if (newState.status === VoiceConnectionStatus.Destroyed) {
                this.leave();
            } else if (
                !this.isReady &&
                (newState.status === VoiceConnectionStatus.Connecting ||
                    newState.status === VoiceConnectionStatus.Signalling)
                )
            {
                this.isReady = true;
                try {
                    await entersState(
                        this.voiceConnection,
                        VoiceConnectionStatus.Ready,
                        20_000,
                    );
                } catch {
                    if (
                        this.voiceConnection.state.status !==
                        VoiceConnectionStatus.Destroyed
                    )
                        this.voiceConnection.destroy();
                } finally {
                    this.isReady = false;
                }
            }
        });

        // When song end and switch to the new one
        this.audioPlayer.on<"stateChange">('stateChange', async(oldState, newState) => {
            if (
                newState.status === AudioPlayerStatus.Idle &&
                oldState.status !== AudioPlayerStatus.Idle
            ) {
                await this.play();
            }
        });

        voiceConnection.subscribe(this.audioPlayer);
    }

    public async addSongs(queueItems: QueueItem[]):Promise<void> {
        this.queue = this.queue.concat(queueItems);
        if (!this.playing) {
            await this.play();
        }
    }

    public stop(): void {
        this.playing = undefined;
        this.queue = [];
        this.audioPlayer.stop();
    }

    //bot leave channel and remove current server
    public leave(): void {
        if (this.voiceConnection.state.status !== VoiceConnectionStatus.Destroyed) {
            this.voiceConnection.destroy();
        }
        this.stop();
        servers.delete(this.guildId);
    }

    // Pause current song
    public pause(): void {
        this.audioPlayer.pause();
    }

    // Resume current song
    public resume(): void {
        this.audioPlayer.unpause();
    }

    // Move to song in queue
    public async jump(pos: number): Promise<QueueItem> {
        const target = this.queue[pos - 1];
        this.queue = this. queue
            .splice(0, pos - 1)
            .concat(this.queue.splice(pos, this.queue.length - 1));
        this.queue.unshift(target);
        await this.play();
        return target;
    }

    // Remove song in queue
    public remove(pos: number): QueueItem {
        return this.queue.splice(pos - 1, 1)[0];
    }

    public async play(): Promise<void> {
        try {
            // Play first song in queue if queue not empty
            if (this.queue.length > 0) {
                this.playing = this.queue.shift() as QueueItem;
                let stream: any;
                const highWaterMark = 1024 * 1024 * 10;
                if (this.playing?.song.platform === Platform.YOUTUBE) {
                    stream = ytdl(this.playing.song.url, {
                        highWaterMark,
                        filter: 'audioonly',
                        quality: 'highestaudio',
                    });
                } else {
                    stream = await SoundCloud.download(this.playing.song.url, {
                        highWaterMark,
                    });
                }
                const audioResource = createAudioResource(stream);
                this.audioPlayer.play(audioResource);
            } else {
                // Stop playing music, playing = undefined
                this.playing = undefined;
                this.audioPlayer.stop();
            }
        } catch (e) {
            // If stream song having trouble, play next song
            this.play();
        }
    }
}
