import BaseCommand from "@structures/BaseCommand.js";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import BaseClient from "@structures/BaseClient.js";

export default class JanuweCommand extends BaseCommand {
	public constructor(client: BaseClient) {
		super(client, {
			name: "januwe",
			description: "The drip is real",
			localizedDescriptions: {
				de: "Der Drip ist real",
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
		return await this.sendJanuwe();
	}

	private async sendJanuwe(): Promise<void> {
		const januweEmbed: EmbedBuilder = this.client.createEmbed("### Der Drip ist da, dass weiß jeder!", null, "normal");
		januweEmbed.setImage("https://cdn.discordapp.com/attachments/1116797977432961197/1180247664332374056/JANNNNUWEEE.png");
		await this.interaction.followUp({ embeds: [ januweEmbed ]});
	}
}
