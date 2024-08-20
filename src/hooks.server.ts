// import { handle as auth_handler } from "./auth"
import { sequence } from "@sveltejs/kit/hooks"
import { AsyncLocalStorage } from "node:async_hooks"
import { init_safe_surreal_db_client, isolated_global } from "$lib/stores/database"
import { verify_jwt } from "$lib/utils/jwt"
import { PUBLIC_SURREAL_NAMESPACE } from "$env/static/public"
import type { TypedSurreal } from "$lib/queries"

const local_storage = new AsyncLocalStorage<ReturnType<typeof isolated_global.getStore>>()

isolated_global.getStore = () => local_storage.getStore()!

export const handle = sequence(
    read_cookie,
    create_async_local_storage,
)

export async function handleError({ error }) {
    console.error(error)

    if(!error) return {
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

async function create_async_local_storage({
    event, resolve
}: Parameters<typeof handle>[0]) {
    let db: Promise<TypedSurreal> | undefined
    return local_storage.run({
        // only initialize the db once per request, and only if we need it
        get_db: () => db ?? (db = init_safe_surreal_db_client(event.locals.token, PUBLIC_SURREAL_NAMESPACE)),
    }, async () => await resolve(event))
}

async function read_cookie({
    event, resolve
}: Parameters<typeof handle>[0]) {
    const token = event.cookies.get("token")

    if (token) {
        // attempt to validate the token
        try {
            await verify_jwt<string>(token)
            event.locals.token = token
        } catch (error) {
            console.error("Invalid Auth token received, removing cookie", error)
            event.cookies.delete("token", { path: "/" })
        }
    }

    return await resolve(event)
}