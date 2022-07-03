import { CommandInteraction } from "discord.js"
export const test = {
    name: 'test',
    execute: async (interaction: CommandInteraction): Promise<void> => {
        await interaction.deferReply();
        await interaction.followUp('Djt con me may'); 
    }
}