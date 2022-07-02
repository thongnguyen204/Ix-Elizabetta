import { Constants, ApplicationCommandData } from "discord.js";

export const schema: ApplicationCommandData[] = [
    {
        name: 'test',
        description: 'This is a test command',
        options: [
            {
                name: 'thong',
                type: Constants.ApplicationCommandOptionTypes.STRING,
                description: 'Thong Nguyen test command',
                required: true,
            },
        ],
    },
];