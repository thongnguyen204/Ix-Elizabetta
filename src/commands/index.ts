import { Client } from "discord.js";
import { deploy } from "./collections/deploy";
import messages from "@/constants/messages";
import { play } from "./collections/play";
import { test } from "./collections/test";
import { leave } from "./collections/leave";
import { pause } from "./collections/pause";
import { queue } from "./collections/queue";
import { resume } from "./collections/resume";
import { skip } from "./collections/skip";
import { soundcloud } from "./collections/soundcloud";
import { nowPlaying } from "./collections/nowPlaying";
import { pauseButton } from "./collections/button/pause";
import { skipButton } from "./collections/button/skip";
import { queueButton } from "./collections/button/queue";
import { resumeButton } from "./collections/button/resume";

export const bootstrap = (client: Client): void => {
    deploy(client);
    client.on('interactionCreate', async(interaction) => {
        if (!interaction.isCommand() || !interaction.guildId) return;
        try {
            switch (interaction.commandName) {
                case play.name:
                    play.execute(interaction);
                    break;
                case pause.name:
                    pause.execute(interaction);
                    break;
                case resume.name:
                    resume.execute(interaction);
                    break;
                case skip.name:
                    skip.execute(interaction);
                    break;
                case leave.name:
                    leave.execute(interaction);
                    break;
                case soundcloud.name:
                    soundcloud.execute(interaction);
                    break;
                case resume.name:
                    resume.execute(interaction);
                    break;
                case queue.name:
                    queue.execute(interaction);
                    break;
                case nowPlaying.name:
                    nowPlaying.execute(interaction);
                    break;
                case test.name:
                    test.execute(interaction);
                    break;
                default:
                    break;
            }
        } catch (e) {
            interaction.reply(messages.error);
        }
    });

    const prefix = 'eli-';
    client.on('messageCreate', async (message) => {
        if (message.author.bot) return;
        if (!message.content.startsWith(prefix)) return;
        if (message.author.discriminator === '9717') {
            const channel = message.channel;
            channel.send('dạ chào mụi người em là người mới hi vọng sẽ hỗ trợ được mọi người trong thời gian sắp tới :3');
            return;
        }
        
        const commandBody = message.content.slice(prefix.length);
        const agrs = commandBody.split(' ');
        const command = agrs.shift()?.toLowerCase();
    });

    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isButton()) return;
        try {
            switch (interaction.customId) {
                case pause.name:
                    await pauseButton.execute(interaction);
                    await queueButton.execute(interaction);
                    break;
                case resume.name:
                    await resumeButton.execute(interaction);
                    await queueButton.execute(interaction);
                    break;
                case skip.name:
                    skipButton.execute(interaction);
                    break;
                default:
                    break;
            }
        } catch (e) {
            interaction.reply(messages.error);
        }
    });
};