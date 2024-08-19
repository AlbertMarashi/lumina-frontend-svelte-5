import { load_page_data } from "$lib/utils/load_page.js"

export async function load({
    url, fetch
}) {
    return await load_page_data(url, fetch)
}