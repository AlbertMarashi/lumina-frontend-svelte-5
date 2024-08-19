import { PUBLIC_BUILDERIO_KEY } from "$env/static/public"
import { fetchOneEntry } from "@builder.io/sdk-svelte"
import { error } from "@sveltejs/kit"
import {find_icon_names, load_icons} from "./util"
import { dev } from "$app/environment"

export async function load_page_data(url: URL, f: typeof fetch) {
    const content = await fetchOneEntry({
        model: "page",
        apiKey: PUBLIC_BUILDERIO_KEY,
        userAttributes: {
            urlPath: url.pathname,
        },
        fetch: f,
        cacheSeconds: dev ? 0 : undefined,
        staleCacheSeconds: dev ? 0 : undefined,
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