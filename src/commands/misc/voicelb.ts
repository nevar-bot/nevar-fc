import BaseCommand from "@structures/BaseCommand.js";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import BaseClient from "@structures/BaseClient.js";
import fs from "fs";

export default class VoicelbCommand extends BaseCommand {
	public constructor(client: BaseClient) {
		super(client, {
			name: "voicelb",
			description: "Shows the voice leaderboard",
			localizedDescriptions: {
				de: "Zeigt das Voice Leaderboard",
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
		return await this.sendVoiceLb();
	}

	private async sendVoiceLb(): Promise<void> {
		const voice: any = JSON.parse(fs.readFileSync("./assets/voice.json").toString());

		const topVoiceUsers: any[] = Object.entries(voice.voiceTime).sort((a: any, b: any): any => b[1] - a[1]);

		function getTime(time: number): string {
			const totalMinutes: number = time / 60000;
			const hours: number = Math.floor(totalMinutes / 60);
			const restMinutes: number = totalMinutes % 60;
			const seconds: number = Math.floor((restMinutes % 1) * 60);

			const formattedTime: string[] = [];

			if (hours > 0) formattedTime.push(`${hours}h`);
			if (restMinutes > 0) formattedTime.push(`${Math.floor(restMinutes)}m`);
			if (seconds > 0) formattedTime.push(`${seconds}s`);

			if(formattedTime.length === 0) formattedTime.push("0s");
			return formattedTime.join(' ').trim();
		}

		const lbData: any[] = [];
		for(let user of topVoiceUsers){
			lbData.push(this.client.emotes.arrow + " <@" + user[0] + "> | " + getTime(user[1]));
		}

		await this.client.utils.sendPaginatedEmbed(this.interaction, 10, lbData, "Voice", "Es wurde noch keine Zeit im Voice verbracht");
	}
}
