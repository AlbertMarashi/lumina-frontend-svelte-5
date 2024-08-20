import { browser } from "$app/environment"
import { PUBLIC_SURREAL_HOST, PUBLIC_SURREAL_NAMESPACE } from "$env/static/public"
import { TypedSurreal } from "$lib/queries"
import { get_cookie_from_document } from "$lib/utils/cookie"

const wrapper: { db?: Promise<TypedSurreal> } = {
    db: browser
        ? init_safe_surreal_db_client(get_cookie_from_document("token"), PUBLIC_SURREAL_NAMESPACE)
        : undefined,
}

export function setDatabase(db: Promise<TypedSurreal>) {
    wrapper.db = db
}

export const isolated_global = {
    getStore(): typeof wrapper {
        throw new Error("AsyncLocalStorage not initialized")
    }
}

export async function safe_db(): Promise<TypedSurreal> {
    if (browser) {
        return await wrapper.db!
    } else {
        const store = isolated_global.getStore()
        return await store.db!
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