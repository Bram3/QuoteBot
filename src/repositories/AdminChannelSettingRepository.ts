import { DataSource } from "typeorm";
import { AdminChannelSetting } from "../entities/AdminChannelSetting";
import logger from "../utils/Logger";

// configure the sqlite database
const dataSource = new DataSource({
  type: "better-sqlite3",
  database: "./data/database.sqlite",
  synchronize: true,
  entities: [AdminChannelSetting],
});

dataSource
  .initialize()
  .then(() => {
    logger.info("Data Source has been initialized!");
  })
  .catch((err) => {
    logger.error("Error during Data Source initialization", err);
  });

// this handles the logic for the admin channel id. it extends the base repository with custom methods
export const AdminChannelSettingRepository = dataSource
  .getRepository(AdminChannelSetting)
  .extend({
    createOrUpdateChannelId(
      channelId: string,
      guildId: string
    ): Promise<AdminChannelSetting> {
      const adminChannelSetting = new AdminChannelSetting();
      adminChannelSetting.guildId = guildId;
      adminChannelSetting.channelId = channelId;
      return this.save(adminChannelSetting);
    },

    getChannelId(guildId: string): Promise<AdminChannelSetting | null> {
      const setting = this.findOne({
        where: { guildId: guildId },
      });
      return setting;
    },
  });
