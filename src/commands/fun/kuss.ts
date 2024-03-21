import BaseCommand from "@structures/BaseCommand.js";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import BaseClient from "@structures/BaseClient.js";

export default class KussCommand extends BaseCommand {
	public constructor(client: BaseClient) {
		super(client, {
			name: "kuss",
			description: "Give a kiss",
			localizedDescriptions: {
				de: "Gib einen Kuss",
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
		return await this.sendKiss();
	}

	private async sendKiss(): Promise<void> {
		const kussEmbed: EmbedBuilder = this.client.createEmbed("### Kussi", null, "normal");
		kussEmbed.setImage("https://cdn.discordapp.com/attachments/1116797977432961197/1177711542960148510/image.png");
		await this.interaction.followUp({ embeds: [ kussEmbed ]});
	}
}
