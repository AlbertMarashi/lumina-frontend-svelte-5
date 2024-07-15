
import { z } from "zod"
import { surrealdb_admin } from "$lib/stores/surrealdb_admin"
import { verify_jwt } from "$lib/utils/jwt.js"
import { json } from "@sveltejs/kit"
import { ResetPasswordQuery } from "$lib/queries/surreal_queries.js"
import { RecordId } from "surrealdb.js"

const input = z.object({
    token: z.string(),
    password: z.string(),
})

export async function POST({ request }) {
    const { token, password } = input.parse(await request.json())

    const { payload: { id } } = await verify_jwt<{ id: string }>(token)

    const [user] = await surrealdb_admin.typed(ResetPasswordQuery, {
        user: new RecordId("user", id),
        password,
    })

    if (!user) {
        return json({ error: { message: "Something went wrong", code: "failed_to_update_user" } }, { status: 400 })
    }

    return json({ success: true })
}