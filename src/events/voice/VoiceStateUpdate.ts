import { ChannelType, EmbedBuilder, VoiceState } from "discord.js";
import BaseClient from "@structures/BaseClient.js";
import * as fs from "fs";
import voiceStateUpdate from "@root/build/events/voice/VoiceStateUpdate";

export default class {
	private client: BaseClient;

	public constructor(client: BaseClient) {
		this.client = client;
	}

	public async dispatch(oldState: VoiceState, newState: VoiceState): Promise<any> {
		if (!oldState || !newState || !newState.guild) return;

		const { channel: oldChannel, member: oldMember } = oldState;
		const { channel: newChannel, member: newMember, guild } = newState;

		const guildData: any = await this.client.findOrCreateGuild(guild.id);

		/* Voice time counter */
		const voiceFile: any = JSON.parse(fs.readFileSync("./assets/voice.json").toString());
		voiceFile.joinTime = voiceFile.joinTime || {};
		voiceFile.voiceTime = voiceFile.voiceTime || {};
		voiceFile.afk = voiceFile.afk || {};

		const now: any = Date.now();

		if(newChannel){
			if(newChannel?.members.size < 2 || newState.mute || newState.deaf){
				if(!voiceFile.afk[newMember!.id]) voiceFile.afk[newMember!.id] = now;
			}
			if(newChannel?.members.size >= 2){
				for(const voiceMember of newChannel.members.values()){
					if(voiceFile.afk[voiceMember.id] && !voiceMember.voice.deaf && !voiceMember.voice.mute && (voiceMember.id !== newMember!.id)){
						delete voiceFile.afk[voiceMember.id];
					}
				}

				if(voiceFile.afk[newMember!.id] && !newState.deaf && !newState.mute){
					const joinDate: any = voiceFile.joinTime[newMember!.id];
					const voiceTime: any = Date.now() - joinDate;

					const afkDate: any = voiceFile.afk[newMember!.id];
					const afkTime: any = Date.now() - afkDate;

					/* Not afk minutes */
					let validTime: any = voiceTime - afkTime;
					if(validTime < 0) validTime = null;

					delete voiceFile.afk[newMember!.id];
					if(validTime) voiceFile.voiceTime[newMember!.id] = (voiceFile.voiceTime[newMember!.id] || 0) + validTime;
					voiceFile.joinTime[newMember!.id] = now;
				}
			}
		}

		if(oldChannel){
			if(oldChannel?.members.size < 2){
				for(const voiceMember of oldChannel.members.values()){
					if(!voiceFile.afk[voiceMember.id]) voiceFile.afk[voiceMember.id] = now;
				}
			}
		}

		if(!oldChannel && newChannel){
			voiceFile.joinTime[newMember!.id] = now;
		}else if(!newChannel && oldChannel){
			const joinDate: any = voiceFile.joinTime[oldMember!.id];
			const voiceTime: any = Date.now() - joinDate;
			let validTime: any = voiceTime;

			if(voiceFile.afk[oldMember!.id]){
				const afkDate: any = voiceFile.afk[oldMember!.id];
				const afkTime: any = Date.now() - afkDate;
				validTime = validTime - afkTime;
				delete voiceFile.afk[oldMember!.id];
			}

			if(validTime < 0) validTime = null;
			delete voiceFile.joinTime[oldMember!.id];
			if(validTime) voiceFile.voiceTime[oldMember!.id] = (voiceFile.voiceTime[oldMember!.id] || 0) + validTime;
		}

		fs.writeFileSync("./assets/voice.json", JSON.stringify(voiceFile, null, 2));

		/* Join to create */
		const { joinToCreate: joinToCreateSettings } = guildData.settings;

		if (newChannel && joinToCreateSettings?.enabled && joinToCreateSettings?.channel) {
			const channelName: string = joinToCreateSettings.defaultName
				.replaceAll("%count", joinToCreateSettings.channels?.length || 1)
				.replaceAll("%user", newMember!.displayName);

			if (newChannel.id !== joinToCreateSettings.channel) return;

			/* Create temp channel */
			const createdTempChannel: any = await guild.channels
				.create({
					name: channelName,
					type: ChannelType.GuildVoice,
					parent: joinToCreateSettings.category ? joinToCreateSettings.category : newChannel.parentId,
					bitrate: parseInt(joinToCreateSettings.bitrate) * 1000,
					position: newChannel.rawPosition,
					userLimit: joinToCreateSettings.userLimit,
				})
				.catch((): any => {
					const errorText: string =
						this.client.emotes.channel +
						" Nutzer/-in: " +
						newMember!.displayName +
						" (@" +
						newMember!.user.username +
						")";
					const errorEmbed: EmbedBuilder = this.client.createEmbed(errorText, null, "error");
					errorEmbed.setTitle(this.client.emotes.error + " Erstellen von Join2Create-Channel fehlgeschlagen");
					return guild.logAction(errorEmbed, "guild");
				});

			if (!createdTempChannel) return;

			/* Set permissions */
			await createdTempChannel.lockPermissions();
			await createdTempChannel.permissionOverwrites
				.create(newMember!.user, {
					Connect: true,
					Speak: true,
					ViewChannel: true,
					ManageChannels: true,
					Stream: true,
					MuteMembers: true,
					DeafenMembers: true,
					MoveMembers: true,
				})
				.catch((): void => {});

			/* Move member */
			await newState
				.setChannel(createdTempChannel)
				.then(async (): Promise<void> => {
					guildData.settings.joinToCreate.channels.push(createdTempChannel.id);
					guildData.markModified("settings.joinToCreate");
					await guildData.save();
				})
				.catch((): void => {
					createdTempChannel.delete().catch((): void => {});
				});
		}

		if (oldChannel) {
			if (!joinToCreateSettings?.channels.includes(oldChannel.id)) return;
			if (oldChannel.members.size >= 1) return;

			/* Delete channel */
			await oldChannel.delete().catch((): void => {
				const errorText: string = this.client.emotes.channel + " Nutzer/-in: " + newMember;
				const errorEmbed: EmbedBuilder = this.client.createEmbed(errorText, null, "error");
				errorEmbed.setTitle(this.client.emotes.error + " Löschen von Join2Create-Channel fehlgeschlagen");
				guild.logAction(errorEmbed, "guild");
			});

			guildData.settings.joinToCreate.channels = guildData.settings.joinToCreate.channels.filter(
				(c: any): boolean => c !== oldChannel.id,
			);
			guildData.markModified("settings.joinToCreate");
			await guildData.save();
		}
	}
}
