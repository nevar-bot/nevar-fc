import BaseCommand from "@structures/BaseCommand.js";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import BaseClient from "@structures/BaseClient.js";

export default class OwnerCommand extends BaseCommand {
	public constructor(client: BaseClient) {
		super(client, {
			name: "owner",
			description: "The true owner of this server",
			localizedDescriptions: {
				de: "Der wahre Owner dieses Servers",
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
		return await this.sendOwner();
	}

	private async sendOwner(): Promise<void> {
		const ownerEmbed: EmbedBuilder = this.client.createEmbed("### Der Owner dieses Servers ist Hopfen", null, "normal");
		await this.interaction.followUp({ embeds: [ ownerEmbed ]});
	}
}
