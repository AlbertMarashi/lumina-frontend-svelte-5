import { alerts_init } from "$lib/stores/alerts"
import { browser, dev } from "$app/environment"
import { PUBLIC_MIXPANEL_TOKEN } from "$env/static/public"
import mixpanel from "mixpanel-browser"
import { init_safe_surreal_db_client, isolated_global } from "$lib/stores/database"

export async function load({ data }) {
    const alerts = alerts_init([])

    // create an async local-storage isolated database client, for the current request
    const store = isolated_global.getStore()
    // resolve the database client promise, so that any subsequent load functions can use it
    store.resolve_db(init_safe_surreal_db_client(data.token))

    if(browser) {
        mixpanel.init(PUBLIC_MIXPANEL_TOKEN, { debug: dev })

        if (data.session) {
            mixpanel.identify(data.session.user.id)
            mixpanel.people.set({
                $name: data.session.user.name,
                $email: data.session.user.email,
                $avatar: data.session.user.image,
            })
        }
    }

    return {
        alerts,
        session: data.session,
        mixpanel,
    }
}
