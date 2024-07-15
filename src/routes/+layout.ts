import { alerts_init } from "$lib/stores/alerts"
import { browser, dev } from "$app/environment"
import { PUBLIC_MIXPANEL_TOKEN } from "$env/static/public"
import mixpanel from "mixpanel-browser"
import { init_safe_surreal_db_client, isolated_global, safe_db } from "$lib/stores/database"
import { GetUserQuery } from "$lib/queries/surreal_queries.js"

export async function load({ data }) {
    const alerts = alerts_init([])

    // create an async local-storage isolated database client, for the current request
    const store = isolated_global.getStore()
    // resolve the database client promise, so that any subsequent load functions can use it
    store.resolve_db(init_safe_surreal_db_client(data.token))

    const db = await safe_db()

    const [user] = await db.typed(GetUserQuery)

    if(browser) {
        mixpanel.init(PUBLIC_MIXPANEL_TOKEN, { debug: dev })

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
        mixpanel,
    }
}
