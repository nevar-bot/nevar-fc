import BaseCommand from "@structures/BaseCommand.js";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import BaseClient from "@structures/BaseClient.js";

export default class AdamyanCommand extends BaseCommand {
	public constructor(client: BaseClient) {
		super(client, {
			name: "adamyan",
			description: "A real model?",
			localizedDescriptions: {
				de: "Ein echtes Model?",
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
		return await this.sendAdamyan();
	}

	private async sendAdamyan(): Promise<void> {
		const adamyanEmbed: EmbedBuilder = this.client.createEmbed("### Model??!?! MODEL!!!", null, "normal");
		adamyanEmbed.setImage("https://cdn.discordapp.com/attachments/1116797977432961197/1175905401464684715/image.png");
		await this.interaction.followUp({ embeds: [ adamyanEmbed ]});
	}
}
