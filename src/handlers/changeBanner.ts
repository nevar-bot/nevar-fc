import BaseClient from "@structures/BaseClient";
import { createCanvas, loadImage, registerFont } from "canvas";
import * as fs from "fs";

async function setMessagesStatsBanner(client: BaseClient): Promise<void> {
	registerFont("./assets/SegoeUI.ttf", { family: "Segoe UI" });

	const guild: any = client.guilds.cache.get(client.config.support["ID"]);
	if(!guild) return;

	const image: any = await loadImage("./assets/messages_banner_template.png");
	const canvas: any = createCanvas(image.width, image.height);
	const ctx: any = canvas.getContext("2d");
	ctx.drawImage(image, 0, 0, image.width, image.height);

	const messages: any = JSON.parse(fs.readFileSync("./assets/messages.json").toString());
	if (!messages.stats) return;

	const topUsers: any = Object.entries(messages.stats)
		.sort((a: any, b: any) => b[1] - a[1])
		.slice(0, 3);


	ctx.font = '45px "Segoe UI"';
	ctx.fillStyle = "black";

	let yCoord: number = 226;
	for (let [userId, messages] of topUsers) {
		const user: any = await client.users.fetch(userId).catch((): void => {});
		if (!user) continue;

		ctx.fillText(user.displayName, 75, yCoord);

		let xCoord: number = 450 - 30 * (Math.max(messages.toString().length - 1, 0));
		ctx.fillText(messages, xCoord, yCoord);

		yCoord += (topUsers.length === 1 ? 90 : 85);
	}

	const buffer: Buffer = canvas.toBuffer("image/png");
	guild.setBanner(buffer).catch((e: any): void => {});
	fs.writeFileSync("./assets/messages_banner.png", buffer);
}

async function setBoosterBanner(client: BaseClient): Promise<void> {
	registerFont("./assets/SegoeUI.ttf", { family: "Segoe UI" });

	const guild: any = client.guilds.cache.get(client.config.support["ID"]);
	if(!guild) return;

	const image: any = await loadImage("./assets/booster_banner_template.png");
	const canvas: any = createCanvas(image.width, image.height);
	const ctx: any = canvas.getContext("2d");

	const boostCount: number|null = guild.premiumSubscriptionCount;
	const boosters: any[] = [];

	const guildMembers: any = await guild.members.fetch();
	for(let member of [...guildMembers]){
		if(member[1].premiumSinceTimestamp) boosters.push(member[1]);
	}

	const randomBooster: any = boosters[Math.floor(Math.random() * boosters.length)];

	ctx.drawImage(image, 0, 0, image.width, image.height);
	ctx.font = "45px SegoeUI";
	ctx.fillStyle = "black";

	ctx.fillText(randomBooster?.displayName || "Unbekannt", 50, 225);
	ctx.font = "100px SegoeUI";
	ctx.fillText(boostCount || 0, 110, 420);
	ctx.fillText(String(boosters.length || 0), 320, 420);

	guild.setBanner(canvas.toBuffer("image/png")).catch((e: any): void => {});
}

export default {
	init(client: BaseClient): void {
		setInterval(
			(): void => {
				switch(client.utils.getRandomInt(1, 2)){
					case 1:
						setMessagesStatsBanner(client);
						break;
					case 2:
						setBoosterBanner(client);
						break;
				}
			},
			5 * 60 * 1000
		);
	}
};