import { alerts_init } from "$lib/stores/alerts"
import {browser } from "$app/environment"
import { PUBLIC_MIXPANEL_TOKEN } from "$env/static/public"
import mixpanel from "mixpanel-browser"
import {init_safe_surreal_db_client, isolated_global, safe_db} from "$lib/stores/database"
import {GetUserQuery, type GetUserResult} from "$lib/queries.js"

export async function load({ data }) {
    // create an async local-storage isolated database client, for the current request
    const store = isolated_global.getStore()
    // resolve the database client promise, so that any subsequent load functions can use it
    store.resolve_db(init_safe_surreal_db_client(data.token, data.namespace))

    const alerts = alerts_init([])


    const db = await safe_db()

    let user: GetUserResult[0][0] | null = null

    if (data.token) {
        const [user_arr] = await db.typed(GetUserQuery)
        user = user_arr[0] ?? null
    } else {
        db.invalidate()
    }

    if(browser) {
        mixpanel.init(PUBLIC_MIXPANEL_TOKEN, {})

        if (user) {
            mixpanel.identify(user.id.toString())
            mixpanel.people.set({
                $name: user.first_name + " " + user.last_name,
                $email: user.email,
                // $avatar: user.image,
            })
        }
    }

    return {
        user,
        alerts,
    }
}

export const ssr = false
export const prerender = true