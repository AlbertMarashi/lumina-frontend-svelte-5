import { PUBLIC_BUILDERIO_KEY } from "$env/static/public"
import { load_page_data } from "$lib/utils/load_page.js"
import { fetchEntries } from "@builder.io/sdk-svelte"

export async function load({
    url, fetch
}) {
    const [page_data, specific_data] = await Promise.all([
        load_page_data(url, fetch),
        specific_page_data(url, fetch)
    ])

    return {
        ...page_data,
        specific_data
    }
}

/// get page specific data
async function specific_page_data(url: URL, fetch: typeof window.fetch) {
    switch (url.pathname) {
        case "/media-and-press":
            return await press_releases(url, fetch)
        default:
            return {}
    }
}

/// get press releases
async function press_releases(url: URL, fetch: typeof window.fetch) {
    const press_releases = (await fetchEntries({
        model: "press-releases",
        apiKey: PUBLIC_BUILDERIO_KEY,
        omit: "data.blocks, data.state",
        sort: {
            "data.datePublished": -1
        },
        fetch
    }) || []).map(release => ({
        ...release.data,
        tags: release.data?.tags?.map((tag: Record<string, unknown>) => tag.tag)
    }))

    return {
        press_releases,
    }
}