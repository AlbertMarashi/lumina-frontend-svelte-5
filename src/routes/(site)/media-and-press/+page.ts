import { PUBLIC_BUILDERIO_KEY } from "$env/static/public"
import { load_page_data } from "$lib/utils/load_page.js"
import { fetchEntries } from "@builder.io/sdk-svelte"

export async function load({ url, fetch }) {

    const press_releases = (await fetchEntries({
        model: "press-releases",
        apiKey: PUBLIC_BUILDERIO_KEY,
        omit: "data.blocks, data.state",
        sort: {
            "data.datePublished": -1
        },
    }) || []).map(release => ({ ...release.data, tags: release.data?.tags?.map((tag: Record<string, unknown>) => tag.tag) }))

    console.log(press_releases[0])

    return {
        press_releases,
        ...await load_page_data(url, fetch)
    }
}