import { safe_db } from "$lib/stores/database"
import { StatementPageQuery } from "$lib/queries"
import { error } from "@sveltejs/kit"

export async function load({
    params, depends
}) {
    const db = await safe_db()

    const [statement] = await db.typed(StatementPageQuery, {
        statement: {
            tb:"statement",
            id: params.statement
        }
    })

    if (!statement) {
        throw error(404, "Statement not found")
    }

    depends("app:statements")

    return {
        statement
    }
}
