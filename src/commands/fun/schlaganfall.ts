import BaseCommand from "@structures/BaseCommand.js";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import BaseClient from "@structures/BaseClient.js";

export default class SchlaganfallCommand extends BaseCommand {
	public constructor(client: BaseClient) {
		super(client, {
			name: "schlaganfall",
			description: "Baumi had a stroke",
			localizedDescriptions: {
				de: "Baumi hat einen Schlaganfall!"
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
		return await this.sendSchlaganfall();
	}

	private async sendSchlaganfall(): Promise<void> {
		const schlaganfallEmbed: EmbedBuilder = this.client.createEmbed("### Baumi hat 2-3 Kölsch zu viel", null, "normal");
		schlaganfallEmbed.setImage("https://cdn.discordapp.com/attachments/1116797977432961197/1177673316375470190/koelns-trainer-steffen-baumgart-geniesst-karnevals.png");
		await this.interaction.followUp({ embeds: [ schlaganfallEmbed ]});
	}
}
