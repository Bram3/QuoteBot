import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class AdminChannelSetting {
  @PrimaryColumn()
  guildId: string;

  @Column()
  channelId: string;
}
