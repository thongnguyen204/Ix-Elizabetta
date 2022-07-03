import { Constants, ApplicationCommandData } from "discord.js";

export const schema: ApplicationCommandData[] = [
    {
        name: 'test',
        description: 'This is a test command',
    },
    {
        name: 'play',
        description: 'Play a song or playlist on Du-tup',
        options: [
            {
                name: 'song',
                type: Constants.ApplicationCommandOptionTypes.STRING,
                description: 'The url or keyword to search videos or playlist on Youtube',
                required: true,
            },
        ],
    },
];