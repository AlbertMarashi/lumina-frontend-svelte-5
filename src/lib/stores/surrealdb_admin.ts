import { SURREAL_PASS, SURREAL_USER, VERCEL_GIT_COMMIT_REF } from "$env/static/private"
import { PUBLIC_SURREAL_HOST } from "$env/static/public"
import { TypedSurreal } from "$lib/queries"

async function get_surreal_db_client() {
    const db = new TypedSurreal()

    const surreal_host = new URL(PUBLIC_SURREAL_HOST)

    if (surreal_host.protocol === "http:") surreal_host.protocol = "ws:"
    if (surreal_host.protocol === "https:") surreal_host.protocol = "wss:"
    surreal_host.pathname = "/rpc"
    await db.connect(surreal_host, {
        namespace: VERCEL_GIT_COMMIT_REF,
        database: "lumina",
        auth: {
            username: SURREAL_USER,
            password: SURREAL_PASS
        },
    })

    return db
}

export const surrealdb_admin = await get_surreal_db_client()