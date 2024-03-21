import BaseCommand from "@structures/BaseCommand.js";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import BaseClient from "@structures/BaseClient.js";

export default class ZitatCommand extends BaseCommand {
	public constructor(client: BaseClient) {
		super(client, {
			name: "zitat",
			description: "A great quote",
			localizedDescriptions: {
				de: "Ein tolles Zitat"
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
		return await this.sendQuote();
	}

	private async sendQuote(): Promise<void> {
		const zitate: any = this.translate("zitate");
		const randomZitat: string = zitate[Math.floor(Math.random() * zitate.length)];
		const zitatEmbed: EmbedBuilder = this.client.createEmbed(randomZitat, "arrow", "normal");
		await this.interaction.followUp({ embeds: [ zitatEmbed ]});
	}
}
