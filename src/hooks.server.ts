// import { handle as auth_handler } from "./auth"
import { sequence } from "@sveltejs/kit/hooks"
import { AsyncLocalStorage } from "node:async_hooks"
import { isolated_global } from "./lib/stores/database"
import { create_resolver } from "$lib/utils/resolver"
import type { TypedSurreal } from "$lib/queries"

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
        event.locals.token = token
    }

    return resolve(event)
}

// async function setup_client_db({ event, resolve }: Parameters<typeof handle>[0]) {
//     const store = stores_object.getStore()!

//     if (!store.db) {
//         store.db = safe_surreal_db_client(event.locals.token)
//     }

//     return resolve(event)
// }

// async function token_data({ event, resolve }: Parameters<typeof handle>[0]) {
//     const session = await event.locals.auth()
//     const user_id = session?.user?.id

//     /// TODO: Should we be generating this every time?
//     /// This is the database authentication token
//     /// We use it to authenticate the user to the database
//     const token = user_id
//         ? await sign_jwt({
//             ns: PUBLIC_SURREAL_NAMESPACE,
//             id: user_id,
//             db: "lumina",
//             tk: "lumina_token",
//             sc: "users",
//         })
//         : null

//     event.locals.session = session
//     event.locals.token = token

//     return resolve(event)
// }
