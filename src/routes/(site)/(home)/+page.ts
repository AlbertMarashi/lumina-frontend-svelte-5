import { UserCountQuery } from "$lib/queries/surreal_queries.js"
import { safe_db } from "$lib/stores/database.js"
import { load_page_data } from "$lib/utils/load_page.js"
import { error } from "@sveltejs/kit"

export async function load({ url, fetch }) {
    const db = await safe_db()

    const [user_count] = await db.typed(UserCountQuery)

    if (!user_count) throw error(500, "Could not get user count")

    return {
        user_count,
        ...await load_page_data(url, fetch)
    }
}