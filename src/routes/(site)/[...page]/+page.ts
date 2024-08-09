import { load_page_data } from "$lib/utils/load_page.js"

export async function load({
    url, fetch 
}) {
    return load_page_data(url, fetch)
}