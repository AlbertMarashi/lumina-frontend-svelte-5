import { LoadTownHallQuery } from "$lib/queries/surreal_queries"
import { safe_db } from "$lib/stores/database"

export async function load({
    depends, url 
}){

    const db = await safe_db()

    const [statements] = await db.typed(LoadTownHallQuery, {
        tags: url.searchParams.get("tag")?.split(",") || []
    })

    depends("app:statements")

    return {
        statements
    }
}