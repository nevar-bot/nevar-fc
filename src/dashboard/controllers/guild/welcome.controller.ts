import { Request, Response } from "express";
import { client } from "@src/app";

import AuthController from "@dashboard/controllers/auth.controller";
import UserController from "@dashboard/controllers/user.controller";
import ErrorController from "@dashboard/controllers/error.controller";

export default {
    async get(req: Request, res: Response): Promise<void> {
        const access_token: string | null = AuthController.getAccessToken(req);

        /* get guild id */
        const guildId: string = req.params.guildId;

        /* check if user is logged in */
        if (!(await AuthController.isLoggedIn(req))) {
            return AuthController.renderLogin(res);
        }

        /* get user info */
        const user: any = await UserController.getUser(access_token);

        /* bot is not in guild */
        if (!client.guilds.cache.get(guildId)) {
            return ErrorController.render404(res, user);
        }

        /* user is not authorized to view this guild */
        const guilds: any = await UserController.getGuilds(access_token);
        if (!(await AuthController.isAuthorizedInGuild(guilds.find((guild: any): boolean => guild.id === guildId)))) {
            return ErrorController.render401(res, user);
        }

        /* check if data was saved */
        const dataSaved: boolean = !!(req as any).session.saved;
        delete (req as any).session.saved;

        /* render page */
        res.render("guild/welcome", {
            client: client,
            title: "Willkommensnachricht",
            module: "welcome",
            guild: client.guilds.cache.get(guildId),
            guildData: await client.findOrCreateGuild(guildId),
            user: user,
            avatarUrl: UserController.getAvatarURL(user),

            /* extra data */
            saved: dataSaved
        });
    },

    async post(req: Request, res: Response): Promise<void> {
        /* get access token */
        const access_token: string | null = AuthController.getAccessToken(req);

        /* get guild id */
        const guildId: string = req.params.guildId;

        /* check if user is logged in */
        if (!(await AuthController.isLoggedIn(req))) {
            return AuthController.renderLogin(res);
        }

        /* get user info */
        const user: any = await UserController.getUser(access_token);

        /* user is not authorized to view this guild */
        const guilds: any = await UserController.getGuilds(access_token);
        if (!(await AuthController.isAuthorizedInGuild(guilds.find((guild: any): boolean => guild.id === guildId)))) {
            return ErrorController.render401(res, user);
        }

        /* get guild data */
        const guildData: any = await client.findOrCreateGuild(guildId);

        /* update guild data */
        guildData.settings.welcome = {
            enabled: !!req.body.status,
            channel: req.body.channel,
            type: req.body.type,
            message: req.body.message,
            autoroles: guildData.settings.welcome.autoroles,
            profilePicture: !!req.body.profilepicture
        };

        /* save guild data */
        guildData.markModified("settings.welcome");
        await guildData.save();

        (req as any).session.saved = true;

        /* avoid rate limits */
        await client.wait(500);

        /* redirect */
        res.status(200).redirect("/dashboard/" + req.params.guildId + "/welcome");
    }
};