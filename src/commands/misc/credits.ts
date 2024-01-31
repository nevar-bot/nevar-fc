import BaseCommand from "@structures/BaseCommand";
import BaseClient from "@structures/BaseClient";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import fs from "fs";
import path from "path";

export default class CreditsCommand extends BaseCommand {
	public constructor(client: BaseClient) {
		super(client, {
			name: "credits",
			description: "Without what would Nevar not have been possible?",
			localizedDescriptions: {
				de: "Ohne was wäre Nevar nicht möglich gewesen?",
			},
			cooldown: 1000,
			dirname: __dirname,
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
		await this.showCredits();
	}

	private async showCredits() {
		const { dependencies } = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../../package.json"), "utf8"));

		const dependenciesArray: any[] = Object.entries(dependencies).map(([name, version]) => ({
			name,
			version: (version as string).replace("^", ""),
		}));

		const creditsString: string =
			dependenciesArray
				.map(
					(dependency) =>
						`${this.client.emotes.shine} [${dependency.name}](https://npmjs.com/package/${dependency.name}/v/${dependency.version}) - ${dependency.version}`,
				)
				.join("\n") + `\n${this.client.emotes.shine} [icons](https://discord.gg/9AtkECMX2P)`;

		const creditsEmbed: EmbedBuilder = this.client.createEmbed(creditsString, null, "normal");
		creditsEmbed.setThumbnail(this.client.user!.displayAvatarURL());
		creditsEmbed.setTitle(this.translate("creditsEmbedTitle", { name: this.client.user!.username }));

		return this.interaction.followUp({ embeds: [creditsEmbed] });
	}
}
