import BaseCommand from "@structures/BaseCommand.js";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import BaseClient from "@structures/BaseClient.js";

export default class GottCommand extends BaseCommand {
	public constructor(client: BaseClient) {
		super(client, {
			name: "gott",
			description: "On day eight",
			localizedDescriptions: {
				de: "Am achten Tag",
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
		return await this.sendGott();
	}

	private async sendGott(): Promise<void> {
		const gottEmbed: EmbedBuilder = this.client.createEmbed("### Am achten Tag schuf er...", null, "normal");
		gottEmbed.setImage("https://cdn.discordapp.com/attachments/1116797977432961197/1177678231185403964/bopp_19_12693-scaled.png");
		await this.interaction.followUp({ embeds: [ gottEmbed ]});
	}
}
