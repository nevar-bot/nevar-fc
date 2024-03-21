import BaseCommand from "@structures/BaseCommand.js";
import { SlashCommandBuilder } from "discord.js";
import BaseClient from "@structures/BaseClient.js";
import fs from "fs";

export default class MessageslbCommand extends BaseCommand {
	public constructor(client: BaseClient) {
		super(client, {
			name: "messageslb",
			description: "Shows the messages leaderboard",
			localizedDescriptions: {
				de: "Zeigt das Nachrichten Leaderboard",
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
		return await this.sendMessagesLb();
	}

	private async sendMessagesLb(): Promise<void> {
		const messages: any = JSON.parse(fs.readFileSync("./assets/messages.json").toString());
		if(!messages.stats) return;

		const mostActiveWriters: any[] = Object.entries(messages.stats).sort((a: any, b: any) => b[1] - a[1]);

		const lbData: any[] = [];
		for(let writer of mostActiveWriters){
			lbData.push(this.client.emotes.arrow + " <@" + writer[0] + "> | " + writer[1] + " Nachrichten");
		}
		await this.client.utils.sendPaginatedEmbed(this.interaction, 10, lbData, "Nachrichten", "Es wurden noch keine Nachrichten gesendet");
	}
}
