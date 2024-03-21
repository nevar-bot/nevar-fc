import BaseCommand from "@structures/BaseCommand.js";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import BaseClient from "@structures/BaseClient.js";

export default class NevarCommand extends BaseCommand {
	public constructor(client: BaseClient) {
		super(client, {
			name: "nevar",
			description: "Credits to Nevar",
			localizedDescriptions: {
				de: "Credits an Nevar",
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
		return await this.sendNevar();
	}

	private async sendNevar(): Promise<void> {
		const nevarEmbed: EmbedBuilder = this.client.createEmbed("### Unser Bot basiert auf Nevar. Gelange hier zur Website: [www.nevar.eu](https://nevar.eu)", null, "normal");
		nevarEmbed.setThumbnail("https://nevar.eu/img/logo.webp");
		await this.interaction.followUp({ embeds: [ nevarEmbed ]});
	}
}
