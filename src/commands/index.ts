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
    const prefix = 'js-';
    client.on('messageCreate', async (message) => {
        if (message.author.bot) return;
        if (!message.content.startsWith(prefix)) return;
        if (message.author.discriminator === '9717') {
            message.reply('Xin chào');
            return;
        }
        
        const commandBody = message.content.slice(prefix.length);
        const agrs = commandBody.split(' ');
        const command = agrs.shift()?.toLowerCase();

    });
};