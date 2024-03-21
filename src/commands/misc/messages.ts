import BaseCommand from "@structures/BaseCommand.js";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import BaseClient from "@structures/BaseClient.js";
import fs from "fs";

export default class MessagesCommand extends BaseCommand {
	public constructor(client: BaseClient) {
		super(client, {
			name: "messages",
			description: "Shows how much messages have been sent",
			localizedDescriptions: {
				de: "Zeigt wie viele Nachrichten heute gesendet wurden",
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
		return await this.sendMessages();
	}

	private async sendMessages(): Promise<void> {
		const messages: any = JSON.parse(fs.readFileSync("./assets/messages.json").toString());
		if(!messages.stats) return;
		const totalMessages: any = Object.values(messages.stats).reduce((a: any, b: any) => a + b, 0) || 0;
		const totalWriters: any = Object.keys(messages.stats).length || 0;
		const mostActiveWriter: any = Object.keys(messages.stats).reduce((a: any, b: any): any => messages.stats[a] > messages.stats[b] ? a : b);

		const messagesEmbed: EmbedBuilder = this.client.createEmbed("Heute wurden bisher **{0} Nachrichten** von **{1} Menschen** geschrieben! Bisher ist <@{2}> der Aktivste! Danke für eure Aktivität <3", "arrow", "normal", totalMessages, totalWriters, mostActiveWriter);
		await this.interaction.followUp({ embeds: [ messagesEmbed ]});
	}
}
