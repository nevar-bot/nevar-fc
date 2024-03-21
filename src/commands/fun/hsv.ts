import BaseCommand from "@structures/BaseCommand.js";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import BaseClient from "@structures/BaseClient.js";

export default class HsvCommand extends BaseCommand {
	public constructor(client: BaseClient) {
		super(client, {
			name: "hsv",
			description: "Nur der HSV",
			localizedDescriptions: {
				de: "Nur der HSV",
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
		return await this.sendHsv();
	}

	private async sendHsv(): Promise<void> {
		const hsvEmbed: EmbedBuilder = this.client.createEmbed("### 25. Mai 1983...", null, "normal");
		hsvEmbed.setImage("https://www.ndr.de/sport/fussball/hsv26964_v-quadratl.jpg");
		await this.interaction.followUp({ embeds: [ hsvEmbed ]});
	}
}
