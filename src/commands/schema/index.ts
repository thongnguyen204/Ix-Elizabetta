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
    {
        name: 'soundcloud',
        description: 'Play a song or playlist on SoundCloud',
        options: [
            {
                name: 'song',
                type: Constants.ApplicationCommandOptionTypes.STRING,
                description: 'The url or keyword to search videos or playlist on SoundCloud',
                required: true,
            }
        ],
    },
    {
        name: 'pause',
        description: 'Pause current song',
    },
    {
        name: 'resume',
        description: 'Resume current song',
    },
    {
        name: 'skip',
        description: 'Skip current song',
    },
    {
        name: 'leave',
        description: 'Kick Elizabetta out of the channel',
    },
    {
        name: 'nowplaying',
        description: 'Check current song',
    },
    {
        name: 'queue',
        description: 'Check current queue',
    },
];