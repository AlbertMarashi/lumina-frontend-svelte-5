import { verify_jwt } from "$lib/utils/jwt"
import { error } from "@sveltejs/kit"

export async function load({ url }) {
    const { searchParams } = new URL(url)
    const token = searchParams.get("token")

    if (!token) {
        throw error(400, {
            code: "INVALID_TOKEN",
            message: "Invalid token",
        })
    }

    /// parse the token
    const { payload } = await verify_jwt<{ email: string }>(token)

    return {
        email: payload.email,
        token,
    }
}