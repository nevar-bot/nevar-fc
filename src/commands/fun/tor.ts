import BaseCommand from "@structures/BaseCommand.js";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import BaseClient from "@structures/BaseClient.js";

export default class TorCommand extends BaseCommand {
	public constructor(client: BaseClient) {
		super(client, {
			name: "tor",
			description: "GOOOAL",
			localizedDescriptions: {
				de: "TOOOOR"
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
		return await this.sendTor();
	}

	private async sendTor(): Promise<void> {
		const torEmbed: EmbedBuilder = this.client.createEmbed("### TOOOOOOR FÜR UNSEREN ERSTEN EFFZEH KÖLN", null, "normal");

		switch(this.client.utils.getRandomInt(1, 3)){
			case 1:
				torEmbed.setImage("https://cdn.discordapp.com/attachments/1116797977432961197/1177713202780455013/image.png");
				break;
			case 2:
				torEmbed.setImage("https://cdn.discordapp.com/attachments/1116797977432961197/1177741549942091897/Bild_2023-11-24_234041758.png");
				break;
			case 3:
				torEmbed.setImage("https://cdn.discordapp.com/attachments/1112805476011348048/1165715823332180088/tor.png");
				break;
		}

		await this.interaction.followUp({ embeds: [ torEmbed ]});
	}
}
