import { CommandInteraction, Permissions, TextChannel } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { inject, injectable } from "tsyringe";
import { QuoteRepository } from "../repositories/QuoteRepository";
import { Quote } from "../entities/Quote";
import { generateEmbedFromQuote } from "../utils/Embed";
import { AdminChannelSettingRepository } from "../repositories/AdminChannelSettingRepository";
import logger from "../utils/Logger";

@Discord()
@injectable()
export class QuoteCommand {
  constructor(
    @inject(QuoteRepository) private quoteRepository: QuoteRepository
  ) {}

  @Slash("quote", {
    description: "Sends one or multiple quotes",
  })
  async quote(
    @SlashOption("tag", {
      description: "The tag of the quote",
      required: false,
    })
    tag: string,
    interaction: CommandInteraction
  ) {
    if (!interaction.member)
      return interaction.reply({
        ephemeral: true,
        content: "There was an error fetching the member",
      });

    let quotes: Quote[] | null = [];

    // we need permissions to see if the member has admin if the member does we should return 3 quotes instead of 1 if
    // the member does not have admin it should also send the quote in dm
    const permissions = interaction.member
      ?.permissions as Readonly<Permissions>;

    if (tag)
      quotes = await this.quoteRepository.getRandomQuotesWithTag(
        tag,
        permissions.has(Permissions.ALL) ? 3 : 1
      );
    else
      quotes = await this.quoteRepository.getRandomQuotes(
        permissions.has(Permissions.ALL) ? 3 : 1
      );

    if (!quotes)
      return interaction.reply({
        ephemeral: true,
        content: "There was an error fetching the quotes",
      });

    if (quotes?.length === 0) {
      return interaction.reply({
        ephemeral: true,
        content: "No quotes were found.",
      });
    }

    // if the member has admin send the quotes in the specified channel
    if (permissions.has(Permissions.ALL)) {
      // get the admin channel setting from the database
      const adminChannelSetting =
        await AdminChannelSettingRepository.getChannelId(interaction.guild!.id);

      if (!adminChannelSetting)
        return interaction.reply({
          ephemeral: true,
          content: "Please set the admin channel first. (/set-admin-channel)",
        });
      const channel = await interaction.client.channels.fetch(
        adminChannelSetting.channelId
      );

      if (!channel)
        return interaction.reply({
          ephemeral: true,
          content: `Could not find the channel with id ${adminChannelSetting.channelId}`,
        });

      if (!(channel instanceof TextChannel)) return;
      channel.send({
        embeds: quotes.map((quote) => {
          return generateEmbedFromQuote(quote, interaction.client.user!);
        }),
      });

      return interaction.reply({
        ephemeral: true,
        content: `Quotes sent in <#${adminChannelSetting.channelId}>!`,
      });
    } else {
      // send the quotes in the channel the command was executed in
      interaction.reply({
        embeds: quotes.map((quote) => {
          return generateEmbedFromQuote(quote, interaction.client.user!);
        }),
        ephemeral: true,
      });

      // send the quotes in dm
      interaction.user.send({
        embeds: quotes.map((quote) => {
          return generateEmbedFromQuote(quote, interaction.client.user!);
        }),
      });
    }
  }
}
