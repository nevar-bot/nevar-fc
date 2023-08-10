import BaseCommand from "@structures/BaseCommand";
import BaseClient from "@structures/BaseClient";
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default class AutoroleCommand extends BaseCommand {
	public constructor(client: BaseClient) {
		super(client, {
			name: "autorole",
			description: "Verwaltet die Rollen, welche neuen Mitgliedern automatisch gegeben werden",
			localizedDescriptions: {
				"en-US": "Manages the roles that are automatically given to new members",
				"en-GB": "Manages the roles that are automatically given to new members"
			},
			memberPermissions: ["ManageGuild"],
			botPermissions: ["ManageRoles"],
			cooldown: 1000,
			dirname: __dirname,
			slashCommand: {
				addCommand: true,
				data: new SlashCommandBuilder()
					.addStringOption((option: any) =>
						option
							.setName("action")
							.setDescription("Wähle aus den folgenden Aktionen")
							.setDescriptionLocalizations({
								"en-US": "Choose from the following actions",
								"en-GB": "Choose from the following actions"
							})
							.setRequired(true)
							.addChoices(
								{
									name: "hinzufügen",
									name_localizations: {
										"en-US": "add",
										"en-GB": "add"
									},
									value: "add"
								},
								{
									name: "entfernen",
									name_localizations: {
										"en-US": "remove",
										"en-GB": "remove"
									},
									value: "remove"
								},
								{
									name: "liste",
									name_localizations: {
										"en-US": "list",
										"en-GB": "list"
									},
									value: "list"
								}
							)
					)
					.addRoleOption((option: any) =>
						option
							.setName("role")
							.setDescription("Wähle eine Rolle")
							.setDescriptionLocalizations({
								"en-US": "Choose a role",
								"en-GB": "Choose a role"
							})
							.setRequired(false))
			}
		});
	}


	public async dispatch(interaction: any, data: any): Promise<void> {
		this.interaction = interaction;
		this.guild = interaction.guild;

		const action: string = interaction.options.getString("action");
		switch (action) {
			case "add":
				await this.addAutorole(interaction.options.getRole("role"), data);
				break;
			case "remove":
				await this.removeAutorole(interaction.options.getRole("role"), data);
				break;
			case "list":
				await this.showList(data);
				break;
			default:
				const unexpectedErrorEmbed: EmbedBuilder = this.client.createEmbed(this.translate("basics:errors:unexpected", { support: this.client.support }), "error", "error");
				return this.interaction.followUp({
					embeds: [unexpectedErrorEmbed]
				});
		}
	}

	private async addAutorole(role: any, data: any): Promise<void> {
		/* Invalid options */
		if (!role || !role.id) {
			const invalidOptionsEmbed: EmbedBuilder = this.client.createEmbed(this.translate("administration/autorole:errors:invalidRole"), "error", "error");
			return this.interaction.followUp({ embeds: [invalidOptionsEmbed] });
		}

		/* Role is @everyone */
		if (role.id === this.interaction.guild.roles.everyone.id) {
			const everyoneEmbed: EmbedBuilder = this.client.createEmbed(
				this.translate("administration/autorole:errors:cantUseEveryone"),
				"error",
				"error"
			);
			return this.interaction.followUp({ embeds: [everyoneEmbed] });
		}

		/* Role is managed */
		if (role.managed) {
			const roleIsManagedEmbed: EmbedBuilder = this.client.createEmbed(
				this.translate("administration/autorole:errors:roleIsManaged"),
				"error",
				"error"
			);
			return this.interaction.followUp({ embeds: [roleIsManagedEmbed] });
		}

		/* Role is higher than the bot's highest role */
		if (this.interaction.guild.members.me.roles.highest.position <= role.position) {
			const roleIsTooHighEmbed: EmbedBuilder = this.client.createEmbed(
				this.translate("administration/autorole:errors:roleIsTooHigh", { role: role.toString(), botRole: this.interaction.guild.members.me.roles.highest.toString() }),
				"error",
				"error"
			);
			return this.interaction.followUp({ embeds: [roleIsTooHighEmbed] });
		}

		/* Role is already an autorole */
		if (data.guild.settings.welcome.autoroles.includes(role.id)) {
			const isAlreadyAutoroleEmbed: EmbedBuilder = this.client.createEmbed(this.translate("administration/autorole:errors:alreadyAdded", { role: role.toString() }), "error", "error");
			return this.interaction.followUp({
				embeds: [isAlreadyAutoroleEmbed]
			});
		}

		/* Add to database */
		data.guild.settings.welcome.autoroles.push(role.id);
		data.guild.markModified("settings.welcome.autoroles");
		await data.guild.save();

		const successEmbed: EmbedBuilder = this.client.createEmbed(this.translate("administration/autorole:added", { role: role.toString() }), "success", "success");
		return this.interaction.followUp({ embeds: [successEmbed] });
	}

	private async removeAutorole(role: any, data: any): Promise<void> {
		/* Invalid options */
		if (!role || !role.id) {
			const invalidOptionsEmbed: EmbedBuilder = this.client.createEmbed(this.translate("administration/autorole:errors:invalidRole"), "error", "error");
			return this.interaction.followUp({ embeds: [invalidOptionsEmbed] });
		}

		/* Role is not an autorole */
		if (!data.guild.settings.welcome.autoroles.includes(role.id)) {
			const isNoAutoroleEmbed: EmbedBuilder = this.client.createEmbed(this.translate("administration/autorole:errors:notAdded", { role: role.toString() }), "error", "error");
			return this.interaction.followUp({ embeds: [isNoAutoroleEmbed] });
		}

		/* Remove from database */
		data.guild.settings.welcome.autoroles = data.guild.settings.welcome.autoroles.filter((r: any): boolean => r !== role.id);
		data.guild.markModified("settings.welcome.autoroles");
		await data.guild.save();

		const successEmbed: EmbedBuilder = this.client.createEmbed(this.translate("administration/autorole:removed", { role: role.toString() }), "success", "success");
		return this.interaction.followUp({ embeds: [successEmbed] });
	}

	private async showList(data: any): Promise<void> {
		let response: any = data.guild.settings.welcome.autoroles;
		const autorolesArray: any[] = [];

		for (let i: number = 0; i < response.length; i++) {
			const cachedRole: any = this.interaction.guild.roles.cache.get(response[i]);
			if (cachedRole) autorolesArray.push(cachedRole.toString());
		}

		await this.client.utils.sendPaginatedEmbed(this.interaction, 5, autorolesArray, this.translate("administration/autorole:list:title"), this.translate("administration/autorole:list:empty"), "ping");
	}
}
