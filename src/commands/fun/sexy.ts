import BaseCommand from "@structures/BaseCommand.js";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import BaseClient from "@structures/BaseClient.js";

export default class SexyCommand extends BaseCommand {
	public constructor(client: BaseClient) {
		super(client, {
			name: "sexy",
			description: "Do you want to see a sexy person?",
			localizedDescriptions: {
				de: "Möchtest du eine sexy Person sehen?"
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
		return await this.sendSexy();
	}

	private async sendSexy(): Promise<void> {
		const sexyEmbed: EmbedBuilder = this.client.createEmbed("### Sexy person is here...", null, "normal");
		sexyEmbed.setImage("https://cdn.discordapp.com/attachments/1116797977432961197/1176558345918881873/SexyHector.png");
		await this.interaction.followUp({ embeds: [ sexyEmbed ]});
	}
}
