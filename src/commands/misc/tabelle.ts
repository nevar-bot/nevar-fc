import BaseCommand from "@structures/BaseCommand.js";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import BaseClient from "@structures/BaseClient.js";
import axios from "axios";

export default class TabelleCommand extends BaseCommand {
	public constructor(client: BaseClient) {
		super(client, {
			name: "tabelle",
			description: "The current Bundesliga table",
			localizedDescriptions: {
				de: "Die aktuelle Bundesliga Tabelle",
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
		return await this.sendTable();
	}

	private async sendTable(): Promise<void> {
		const table: any = (await axios.get("https://api.openligadb.de/getbltable/bl1/2023")).data;

		let tableString: string = "";
		let i: number = 0;

		for(let place of table){
			i++;
			switch(place.shortName){
				case "Leverkusen":
					tableString += this.client.emotes.arrow + " " + i + ". Bayer Pillenkusen - " + place.points + " Punkte\n";
					break;
				case "Köln":
					tableString += "**" + this.client.emotes.arrow + " " + i + ". " + place.shortName + " - " + place.points + " Punkte**\n";
					break;
				case "Gladbach":
					tableString += this.client.emotes.arrow + " " + i + ". Kackbach - " + place.points + " Punkte\n";
					break;
				case "Leipzig":
					tableString += this.client.emotes.arrow + " " + i + ". Dosen - " + place.points + " Punkte\n";
					break;
				default:
					tableString += this.client.emotes.arrow + " " + i + ". " + place.shortName + " - " + place.points + " Punkte\n";
					break;
			}
			tableString += "Spiele: " + place.matches + " (" + place.won + "S, " + place.draw + "U, " + place.lost + "N)\n";
			tableString += "Tordifferenz: " + place.goalDiff + " (" + place.goals + ":" + place.opponentGoals + ")\n\n";
		}

		const tableEmbed: EmbedBuilder = this.client.createEmbed(tableString, null, "normal");
		await this.interaction.followUp({ embeds: [ tableEmbed ]});
	}
}
