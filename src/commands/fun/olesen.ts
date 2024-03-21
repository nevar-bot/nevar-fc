import BaseCommand from "@structures/BaseCommand.js";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import BaseClient from "@structures/BaseClient.js";

export default class OlesenCommand extends BaseCommand {
	public constructor(client: BaseClient) {
		super(client, {
			name: "olesen",
			description: "Is it the real one? The real Olesen?",
			localizedDescriptions: {
				de: "Ist es der echte? Der echte Olesen?",
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
		return await this.sendOlesen();
	}

	private async sendOlesen(): Promise<void> {
		const olesenEmbed: EmbedBuilder = this.client.createEmbed("### Ist dass der echte? JA es ist...", null, "normal");
		olesenEmbed.setImage("https://cdn.discordapp.com/attachments/1116797977432961197/1175852167047958628/OLESEEEN.png");
		await this.interaction.followUp({ embeds: [ olesenEmbed ]});
	}
}
