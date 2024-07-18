import { safe_db } from "$lib/stores/database"
import { StatementPageQuery } from "$lib/queries/surreal_queries"
import { RecordId } from "surrealdb.js"

export async function load({ params}) {
    const db = await safe_db()

    const [debate] = await db.typed(StatementPageQuery, {
        statement: new RecordId("statement", params.statement)
    })

    return {
        debate
    }
}
