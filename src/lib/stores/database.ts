import { browser } from "$app/environment"
import { PUBLIC_SURREAL_HOST, PUBLIC_SURREAL_NAMESPACE } from "$env/static/public"
import { TypedSurreal } from "$lib/queries"
import { get_cookie_from_document } from "$lib/utils/cookie"
import { request_symbol } from "safe-ssr"

const db = browser
    ? init_safe_surreal_db_client(get_cookie_from_document("token"), PUBLIC_SURREAL_NAMESPACE)
    : undefined

export const ssr_databases = new WeakMap<symbol, () => Promise<TypedSurreal>>()

export async function safe_db(): Promise<TypedSurreal> {
    if (browser) {
        return await db!
    } else {
        const db = ssr_databases.get(request_symbol.current())!()
        return await db
    }
}

export async function init_safe_surreal_db_client(token: string | null, namespace: string) {
    const db = new TypedSurreal()

    const surreal_host = new URL(PUBLIC_SURREAL_HOST)

    if (surreal_host.protocol === "http:") surreal_host.protocol = "ws:"
    if (surreal_host.protocol === "https:") surreal_host.protocol = "wss:"
    surreal_host.pathname = "/rpc"

    await db.connect(surreal_host, {
        namespace,
        database: "lumina",
        auth: token ?? undefined,
    })

    return db
}