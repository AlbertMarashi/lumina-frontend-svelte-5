import { goto } from "$app/navigation"
import { page } from "$app/stores"
import { get } from "svelte/store"

// Ensures that calls to this function are only made when the user is authenticated
export default function auth_guard<Args extends unknown[], T>(
    callback: (...args: Args) => T
) {
    return (...args: Args) => {
        if (get(page).data.user) {
            return callback(...args)
        } else {
            get(page).data.alerts.create_alert("error", "You must be logged in to perform this action.")
            goto("/auth")
        }
    }
}