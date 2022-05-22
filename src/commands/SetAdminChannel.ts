import { CommandInteraction, TextChannel } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { AdminChannelSettingRepository } from "../repositories/AdminChannelSettingRepository";
import { onlyDescriptionEmbed } from "../utils/Embed";

@Discord()
export class SetAdminChannel {
  @Slash("set-admin-channel", {
    description: "Sets the admin channel",
  })
  async sendMessage(
    @SlashOption("channel", {
      description:
        "The channel (if not specified it will use the channel this command is executed in)",
      required: false,
    })
    channel: TextChannel,
    interaction: CommandInteraction
  ) {
    // save the new channel id to the database
    const adminChannelSetting =
      await AdminChannelSettingRepository.createOrUpdateChannelId(
        channel ? channel.id : interaction.channel!.id,
        interaction.guild!.id
      );
    const embed = onlyDescriptionEmbed(
      `Succesfully set the admin channel to <#${adminChannelSetting.channelId}>.`,
      interaction.client.user!
    );
    interaction.reply({ embeds: [embed] });
  }
}
