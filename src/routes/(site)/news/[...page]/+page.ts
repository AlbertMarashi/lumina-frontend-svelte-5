import { PUBLIC_BUILDERIO_KEY } from "$env/static/public"
import {find_icon_names, load_icons} from "$lib/utils/util.js"
import { fetchOneEntry } from "@builder.io/sdk-svelte"
import { error } from "@sveltejs/kit"

export async function load({
    url, fetch: f
}) {
    const content = await fetchOneEntry({
        model: "press-releases",
        apiKey: PUBLIC_BUILDERIO_KEY,
        userAttributes: {
            urlPath: url.pathname,
        },
    })

    if (!url.searchParams.get("builder.preview") && !content) {
        throw error(404, {
            message: "Page not found",
            code: "NOT_FOUND",
        })
    }

    const icon_names = new Set<string>()

    find_icon_names(content?.data?.blocks || [], icon_names)

    return {
        content,
        icons: await load_icons([...icon_names], f),
        title: content?.data?.title,
        description: content?.data?.description,
    }
}