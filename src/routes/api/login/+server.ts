import {error, json} from "@sveltejs/kit"
import { z } from "zod"
import { surrealdb_admin } from "$lib/stores/surrealdb_admin.js"
import { UserLoginQuery } from "$lib/queries.js"
import { VERCEL_GIT_COMMIT_REF } from "$env/static/private"
import { sign_jwt } from "$lib/utils/jwt.js"
import { record_to_string } from "$lib/pojo_surreal.js"

const input = z.object({
    email: z.string().email(),
    password: z.string(),
})

export async function POST({ request }) {
    const {
        email, password
    } = input.parse(await request.json())

    const [[user]] = await surrealdb_admin.typed(UserLoginQuery, {
        email,
        password,
    })

    console.log(user)

    if (!user) {
        throw error(400, {
            code: "INVALID_CREDENTIALS",
            message: "User not found or password is incorrect",
        })
    }

    const token = await sign_jwt<{
        ns: string,
        id: string,
        db: string,
        tk: string,
        sc: string,
        scopes: string[]
    }>({
        ns: VERCEL_GIT_COMMIT_REF,
        id: record_to_string(user.id),
        db: "lumina",
        tk: "lumina_token",
        sc: "users",
        scopes: ["*"]
    })

    return json({
        token
    })
}