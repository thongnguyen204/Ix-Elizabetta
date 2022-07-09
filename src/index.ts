import { config } from "dotenv";
import { SoundCloud } from "scdl-core";
config();

if (process.env.NODE_ENV === "production") {
  require("module-alias/register");
}

import { Client, Intents } from "discord.js";
import { bootstrap } from "./commands";
import express, { Request, Response } from "express";
import herokuAwake from 'heroku-awake';

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_INTEGRATIONS,
  ],
});

client.on("ready", () => {
  console.log(`> Bot is on ready`);
});

const env = process.env.ENV;
let token = process.env.TOKEN;

if (env === 'LOCAL') {
  token = process.env.LOCAL;
}

client.login(token).then(async () => {
  await SoundCloud.connect();
  bootstrap(client);
});

const app = express();

app.get('/', (_req: Request, res: Response) => {
  return res.send({
    message: 'Bot is up and running',
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`> Bot is on listening`);
  // herokuAwake(process.env.APP_URL || 'http://localhost:3000');
})
