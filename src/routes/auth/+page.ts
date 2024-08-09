// import { GetAuthAppDocument } from "$lib/graphql/graphql-types.js"

import type { OAuthApp } from "$lib/types/OAuth.js"
import { error } from "@sveltejs/kit"

export async function load ({
    parent, url, fetch 
}) {
    const data = await parent()

    const slug = url.searchParams.get("app-slug")
    const redirect = url.searchParams.get("redirect")

    if (typeof slug === "string") {
        const res = await fetch("/api/oauth", {
            method: "POST",
            body: JSON.stringify({
                slug,
            }),
        })

        const app: OAuthApp = await res.json()

        if (!app) {
            data.alerts.create_alert("error", "App not found")
            throw error(404, {
                code: "APP_NOT_FOUND",
                message: "App not found",
            })
        }

        if (!redirect) {
            data.alerts.create_alert("error", "Redirect not specified")
            throw error(400, {
                code: "REDIRECT_NOT_SPECIFIED",
                message: "Redirect not specified",
            })
        }

        if (!app.redirect_hostnames.includes(new URL(redirect).hostname)) {
            data.alerts.create_alert("error", `Redirect hostname not allowed for ${app.name}`)
            throw error(400, {
                code: "INVALID_REDIRECT_HOSTNAME",
                message: `Redirect hostname not allowed for ${app.name}`,
            })
        }

        return {
            app_info: {
                app,
                redirect,
                slug,
            }
        }
    }

    return {}
}