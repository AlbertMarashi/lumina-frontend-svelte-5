import { safe_request_wrapper } from "safe-ssr/safe_request_wrapper"
import { request_symbol } from "safe-ssr"
import { sequence } from "@sveltejs/kit/hooks"
import { init_safe_surreal_db_client, ssr_databases } from "$lib/stores/database"
import { verify_jwt } from "$lib/utils/jwt"
import { PUBLIC_SURREAL_NAMESPACE } from "$env/static/public"
import type { TypedSurreal } from "$lib/queries"

export const handle = sequence(
    read_cookie,
    safe_request_wrapper,
    setup_isolated_db,
)

export async function handleError({ error }) {
    console.error(error)

    if (!error)
        return {
            message: "Internal server error",
            code: "unknown_code",
        }

    return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        message: (error as any)?.message ?? "Internal server error",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        code: (error as any)?.code ?? "unknown_code",
    }
}

async function setup_isolated_db({
    event,
    resolve,
}: Parameters<typeof handle>[0]) {
    let db: Promise<TypedSurreal> | undefined

    ssr_databases.set(request_symbol.current(), () => db ?? (db = init_safe_surreal_db_client(
        event.locals.token,
        PUBLIC_SURREAL_NAMESPACE,
    )))

    return await resolve(event)
}

async function read_cookie({ event, resolve }: Parameters<typeof handle>[0]) {
    const token = event.cookies.get("token")

    if (token) {
        // attempt to validate the token
        try {
            await verify_jwt<string>(token)
            event.locals.token = token
        } catch (error) {
            console.error(
                "Invalid Auth token received, removing cookie",
                error,
            )
            event.cookies.delete("token", { path: "/" })
        }
    }

    return await resolve(event)
}
