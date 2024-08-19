import { create_resolver } from "$lib/utils/resolver"
import {PUBLIC_SURREAL_HOST, PUBLIC_SURREAL_NAMESPACE} from "$env/static/public"
import { TypedSurreal } from "$lib/queries"

class ClientStore {
    store: {
        db: Promise<TypedSurreal>,
        resolve_db: (db: TypedSurreal | PromiseLike<TypedSurreal>) => void
    }

    constructor() {
        const resolver = create_resolver<TypedSurreal>()
        this.store = {
            db: resolver.promise,
            resolve_db: resolver.resolve,
        }
    }

    getStore() {
        return this.store
    }
}

const local_stores = new ClientStore()

export const isolated_global = {
    getStore(): ClientStore["store"] {
        return local_stores.getStore()
    },
}

export async function safe_db(): Promise<TypedSurreal> {
    const store = isolated_global.getStore()

    return store.db
}

export async function init_safe_surreal_db_client(token: string | null) {
    const db = new TypedSurreal()

    const surreal_host = new URL(PUBLIC_SURREAL_HOST)

    if (surreal_host.protocol === "http:") surreal_host.protocol = "ws:"
    if (surreal_host.protocol === "https:") surreal_host.protocol = "wss:"
    surreal_host.pathname = "/rpc"
    await db.connect(surreal_host, {
        namespace: PUBLIC_SURREAL_NAMESPACE,
        database: "lumina",
        auth: token ?? undefined,
    })

    return db
}