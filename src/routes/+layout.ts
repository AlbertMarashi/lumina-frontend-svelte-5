import { alerts_init } from "$lib/stores/alerts"
import {browser } from "$app/environment"
import { PUBLIC_MIXPANEL_TOKEN } from "$env/static/public"
import mixpanel from "mixpanel-browser"
import {safe_db} from "$lib/stores/database"
import {GetUserQuery, type GetUserResult} from "$lib/queries.js"

export async function load() {
    const alerts = alerts_init([])

    const db = await safe_db()

    let user: GetUserResult[0][0] | null = null

    if (db.connection?.connection.token) {
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
