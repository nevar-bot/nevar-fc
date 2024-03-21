import BaseCommand from "@structures/BaseCommand.js";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import BaseClient from "@structures/BaseClient.js";

export default class KeeperCommand extends BaseCommand {
	public constructor(client: BaseClient) {
		super(client, {
			name: "keeper",
			description: "This is our keeper",
			localizedDescriptions: {
				de: "Unser Stammkeeper",
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
		return await this.sendKeeper();
	}

	private async sendKeeper(): Promise<void> {
		const keeperEmbed: EmbedBuilder = this.client.createEmbed("### Hier ist UNSERE NUMMER 44. MATHIAAAAAAS KÖBBBBIIINNNGGGGGGGG!!!!!", null, "normal");
		keeperEmbed.setImage("https://cdn.discordapp.com/attachments/1116797977432961197/1177675326147539035/Bild_2023-11-24_191709869.png");
		await this.interaction.followUp({ embeds: [ keeperEmbed ]});
	}
}
