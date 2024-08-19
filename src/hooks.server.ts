// import { handle as auth_handler } from "./auth"
import { sequence } from "@sveltejs/kit/hooks"
import { AsyncLocalStorage } from "node:async_hooks"
import { isolated_global } from "./lib/stores/database"
import { create_resolver } from "$lib/utils/resolver"
import type { TypedSurreal } from "$lib/queries"
import { verify_jwt } from "$lib/utils/jwt"

const local_storage = new AsyncLocalStorage<{
    db: Promise<TypedSurreal>
    resolve_db: (db: TypedSurreal | PromiseLike<TypedSurreal>) => void
}>()

isolated_global.getStore = () => local_storage.getStore()!

export const handle = sequence(
    // auth_handler,
    read_cookie,
    create_async_local_storage,
    // setup_client_db,
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
    const resolver = create_resolver<TypedSurreal>()

    // let safe_surreal_db_client(event.locals.token)
    return local_storage.run({
        db: resolver.promise,
        resolve_db: resolver.resolve
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

    return resolve(event)
}