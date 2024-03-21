import BaseClient from "@structures/BaseClient";
import * as fs from "fs";
import {AttachmentBuilder, EmbedBuilder} from "discord.js";

async function evaluateMessageStats(client: BaseClient): Promise<void> {
	const messages: any = JSON.parse(fs.readFileSync("./assets/messages.json").toString());

	if(!messages.stats) return;
	const totalMessages: any = Object.values(messages.stats).reduce((a: any, b: any) => a + b, 0) || 0;
	const totalWriters: any = Object.keys(messages.stats).length || 0;
	const mostActiveWriter: any = Object.keys(messages.stats).reduce((a: any, b: any): any => messages.stats[a] > messages.stats[b] ? a : b);

	const guild: any = client.guilds.cache.get(client.config.support["ID"]);
	if(!guild) return;

	const pokalSiegerRole: any = guild.roles.cache.get(client.config.support["POKALSIEGER"]);

	const addRole = (userId: string, threshold: number, roleId: string): void => {
		const member: any = guild.members.cache.get(userId);
		if(member && messages.stats[userId] >= threshold){
			member.roles.add(roleId).catch((): void => {});
		}
	}

	for(const userId in messages.stats || {}){
		addRole(userId, 100, "1179181120596738139");
		addRole(userId, 250, "1179181792587153549");
		addRole(userId, 500, "1179181862543958047");
		addRole(userId, 1000, "1179181918537912404");
	}

	pokalSiegerRole?.members.forEach((member: any, i: number): void => {
		setTimeout((): void => {
			member.roles.remove(pokalSiegerRole).catch((): void => {});
		}, i * 1000);
	});

	await client.wait(5000);

	guild.members.cache.get(mostActiveWriter).roles.add(pokalSiegerRole).catch((): void => {});


	const messageStatisticsEmbed: EmbedBuilder = client.createEmbed(getEmbedMessage(totalMessages, totalWriters, mostActiveWriter), null, "normal");
	const topThreeBannerAttachment: AttachmentBuilder = new AttachmentBuilder("./assets/messages_banner.png");
	messageStatisticsEmbed.setImage("attachment://messages_banner.png");

	const channel: any = guild.channels.cache.get(client.config.channels["LOBBY_ID"]);
	channel.send({ embeds: [messageStatisticsEmbed], files: [topThreeBannerAttachment] });

	fs.writeFileSync("./assets/messages.json", JSON.stringify({}));


	function getEmbedMessage(count: number, writers: number, mostActiveUser: any): string {
		const thresholds: number[] = [250, 750, 1500, 3000];
		const messages: string[] = [
			"Ein depremierender Tag für unseren Server!",
			"Hey, morgen wirds besser!",
			"Klasse!",
			"Sehr stark!!!",
			"Wenn selbst Hennes stolz ist, dann wisst ihr, ihr habts geschafft!"
		];

		for(let i = 0; i < thresholds.length; i++){
			if(count <= thresholds[i] || i === thresholds.length - 1){
				return messages[i] + " Heute wurden **" + count + " Messages** von **" + writers + " Personen** geschrieben! Der aktivste User war <@" + mostActiveUser + ">! Danke für eure Aktivität <3";
			}
		}
		return "";
	}
}

export default evaluateMessageStats;