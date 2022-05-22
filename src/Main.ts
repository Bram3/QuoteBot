import "reflect-metadata";
import { config } from "dotenv";
import logger from "./utils/Logger";
import { Client, DIService } from "discordx";
import { Intents } from "discord.js";
import { importx } from "@discordx/importer";
import { container, inject, singleton } from "tsyringe";
import { InjectionTokens } from "./DI/InjectionTokens";
import { QuoteRepository } from "./repositories/QuoteRepository";
config();

@singleton()
export class Main {
  constructor(@inject(InjectionTokens.Token) private token: string) {}

  public async start() {
    const client = new Client({
      botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],
      intents: [Intents.FLAGS.GUILDS],
    });
    // I am doing this so discordx registers all events in the folders 'commands' and 'events'
    await importx(`${__dirname}/{commands,events}/**/*.{ts,js}`);

    // I am registering this client instance so I can use this in other classes with dependency injection
    container.registerInstance(Client, client);

    // container.registerInstance(DataSource, dataSource);

    container.registerInstance(QuoteRepository, new QuoteRepository());

    logger.info("Connecting...");
    await client.login(this.token);
  }
}

const { TOKEN } = process.env;
if (!TOKEN) {
  logger.error("Token not found! Please set your token in the .env file.");
  process.exit();
}

// I am doing this so all classes annoted with @Discord work with DI
DIService.container = container;

container.registerInstance(InjectionTokens.Token, TOKEN);
(async (): Promise<void> => {
  // Starting the bot
  await container.resolve(Main).start();
})();
