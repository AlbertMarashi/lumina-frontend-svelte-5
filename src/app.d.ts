import type { GetUserResult, TypedSurreal } from "$lib/queries"
import type { AlertsStore } from "$lib/stores/alerts"
import type { TypedSurreal } from "$lib/queries"
// import type { Session } from "@auth/core/types"

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
    namespace App {
        // interface Platform {}

        interface Locals {
            // Authenticated session
            token: string | null
        }

        interface PageData {
            // Safe client-authenticated SurrealDB
            db: TypedSurreal;
            alerts: AlertsStore;
            user: GetUserResult[0][0] | null
        }

        interface Error {
            code?: string;
            cause?: Error;
            message: string;
            stack?: string;
        }
    }
}

export {}
