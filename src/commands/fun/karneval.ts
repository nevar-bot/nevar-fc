import BaseCommand from "@structures/BaseCommand.js";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import BaseClient from "@structures/BaseClient.js";

export default class KarnevalCommand extends BaseCommand {
	public constructor(client: BaseClient) {
		super(client, {
			name: "karneval",
			description: "When is Karneval?",
			localizedDescriptions: {
				de: "Wann ist Karneval?"
			},
			cooldown: 3 * 1000,
			dirname: import.meta.url,
			slashCommand: {
				addCommand: true,
				data: new SlashCommandBuilder(),
			},
		});
	}

	public async dispatch(interaction: any, data: any): Promise<void> {
		this.interaction = interaction;
		this.guild = interaction.guild;
		this.data = data;
		return await this.sendKarneval();
	}

	private async sendKarneval(): Promise<void> {
		const karnevalString: string =
			"**Viva Colonia** und **Leev Marie** durch alle Straßen in Köln hören!\n" +
			"Dieses Jahr ist **Weiberfastnacht** am **08.02.**\n" +
			"Der **Aschermittwoch** wo bekanntlich alles **vorbei** ist, ist dann 6 Tage später am **14.02.**\n\n" +
			"**Rosenmontag** ist natürlich 2 Tage vorher am **12.02.2024** um **11:11 Uhr**\n" +
			"Das ist **__<t:1707732660:R>__**";
		const karnevalEmbed: EmbedBuilder = this.client.createEmbed(karnevalString, null, "normal");
		karnevalEmbed.setImage("https://cdn.discordapp.com/attachments/1078810235336130630/1196187904595210360/fckarneval.png");
		await this.interaction.followUp({ embeds: [ karnevalEmbed ]});
	}
}
