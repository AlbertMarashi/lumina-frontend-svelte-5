import { safe_db } from "$lib/stores/database"
import { StatementPageQuery } from "$lib/queries"
import { error } from "@sveltejs/kit"

export async function load({
    params
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

    return {
        statement
    }
}
