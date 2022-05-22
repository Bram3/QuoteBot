import { HexColorString, MessageEmbed, User } from "discord.js";
import { Quote } from "../entities/Quote";

export function generateEmbedFromQuote(quote: Quote, user: User): MessageEmbed {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return new MessageEmbed()
    .setFooter({
      text: user.username,
      iconURL: user.displayAvatarURL({ dynamic: true }),
    })
    .setTimestamp()
    .setColor(`#${randomColor}` as HexColorString)
    .setDescription(`${quote.$content}\n\n- ${quote.$author}`);
}

export function onlyDescriptionEmbed(
  description: string,
  user: User
): MessageEmbed {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return new MessageEmbed()
    .setFooter({
      text: user.username,
      iconURL: user.displayAvatarURL({ dynamic: true }),
    })
    .setTimestamp()
    .setColor(`#${randomColor}` as HexColorString)
    .setDescription(description);
}
