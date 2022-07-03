import { Client } from "discord.js";
import { deploy } from "./collections/deploy";
import messages from "@/constants/messages";
import { play } from "./collections/play";
import { test } from "./collections/test";

export const bootstrap = (client: Client): void => {
    deploy(client);
    client.on('interactionCreate', async(interaction) => {
        if (!interaction.isCommand() || !interaction.guildId) return;
        try {
            switch (interaction.commandName) {
                case play.name:
                    play.execute(interaction);
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