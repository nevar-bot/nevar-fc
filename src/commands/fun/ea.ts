import BaseCommand from "@structures/BaseCommand.js";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import BaseClient from "@structures/BaseClient.js";

export default class EaCommand extends BaseCommand {
	public constructor(client: BaseClient) {
		super(client, {
			name: "ea",
			description: "We hate EA",
			localizedDescriptions: {
				de: "Wir hassen EA",
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
		return await this.sendEa();
	}

	private async sendEa(): Promise<void> {
		const eaEmbed: EmbedBuilder = this.client.createEmbed("### EA...", null, "normal");
		eaEmbed.setImage("https://cdn.discordapp.com/attachments/1116797977432961197/1177681229068390460/image.png");
		await this.interaction.followUp({ embeds: [ eaEmbed ]});
	}
}
