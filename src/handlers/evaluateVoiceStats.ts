import BaseClient from "@structures/BaseClient";
import * as fs from "fs";

async function evaluateVoiceStats(client: BaseClient): Promise<void> {
	const voice: any = JSON.parse(fs.readFileSync("./assets/voice.json").toString());

	for(const userId in voice.voiceTime){
		if(voice.joinTime[userId]){
			const joinDate: any = voice.joinTime[userId];
			const userVoiceTime: any = Date.now() - joinDate;

			voice.voiceTime[userId] = (voice.voiceTime[userId] || 0) + userVoiceTime;

			voice.joinTime = voice.joinTime || {};
			voice.joinTime[userId] = Date.now();
		}
	}
	fs.writeFileSync("./assets/voice.json", JSON.stringify(voice, null, 2));

	const guild: any = client.guilds.cache.get(client.config.support["ID"]);
	if(!guild) return;

	for(const userId in voice.voiceTime) {
		const member: any = guild.members.cache.get(userId);
		if(!member) continue;

		const userVoiceTime: number = voice.voiceTime[userId];

		const mostActiveUser: any = Object.keys(voice.voiceTime || {}).reduce((a: any, b: any): any => (voice.voiceTime[a] > voice.voiceTime[b] ? a : b));

		const pokalSiegerRole: any = guild.roles.cache.get(client.config.support["POKALSIEGER"]);
		pokalSiegerRole?.members.forEach((member: any, i: number): void => {
			setTimeout((): void => {
				member.roles.remove(pokalSiegerRole).catch((): void => {});
			}, i * 1000);
		});

		guild.members.cache.get(mostActiveUser).roles.add(pokalSiegerRole).catch((): void => {});

		const rolesToAdd: any[] = [
			{ time: 60 * 1, roleId: "1180193937546289192" },
			{ time: 60 * 4, roleId: "1180194548366970941" },
			{ time: 60 * 8, roleId: "1180194581187395667" },
			{ time: 60 * 12, roleId: "1180194611847762020" },
		];

		rolesToAdd.forEach((roleToAdd: any): void => {
			if(userVoiceTime >= roleToAdd.time){
				member.roles.add(roleToAdd.roleId);
			}
		})
	}

	voice.voiceTime = {};
	fs.writeFileSync("./assets/voice.json", JSON.stringify(voice, null, 2));
}

export default evaluateVoiceStats;