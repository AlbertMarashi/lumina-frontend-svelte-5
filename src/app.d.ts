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

// declare module "@auth/core/types" {
// 	// interface JWT {
// 	// 	id: string
// 	// 	email: string
// 	// 	name: string
// 	// 	image?: string
// 	// }

// 	interface User {
// 		id: string
// 		name: string
// 		email: string
// 		image?: string,
// 		provider?: string,
// 	}

// 	interface Session {
// 		user: User//& DefaultSession["user"]
// 		expires: string
// 	}
// }

// declare module "@auth/core/jwt" {
// 	interface JWT {
// 		id: string
// 		email: string
// 		name: string
// 		image?: string
// 	}
// }


declare module "svelte/elements" {
    interface SvelteHTMLElements {
        "svelte:element": HTMLAttributes<HTMLElement | HTMLAnchorElement> & {
            href?: string
        }
        [name: `${string}${
			| "a"
			| "b"
			| "c"
			| "d"
			| "e"
			| "f"
			| "g"
			| "h"
			| "i"
			| "j"
			| "k"
			| "l"
			| "m"
			| "n"
			| "o"
			| "p"
			| "q"
			| "r"
			| "s"
			| "t"
			| "u"
			| "v"
			| "w"
			| "x"
			| "y"
			| "z"
		}`,
        ]: HTMLAttributes<HTMLElement> & {
            href?: string
        }
    }
}
export {}