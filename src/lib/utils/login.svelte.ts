import { invalidateAll } from "$app/navigation"
import { page } from "$app/stores"
import { get } from "svelte/store"
import { set_cookie } from "./cookie"
import mixpanel from "mixpanel-browser"
import { safe_db } from "$lib/stores/database"
import { api } from "./api"

export async function login(email: string, password: string) {
    const page_data = get(page).data
    const db = await safe_db()

    try {
        const { token } = await api<{
            token: string,
            error: unknown
        }>("/api/login", "POST", {
            email,
            password,
        })

        await db.authenticate(token)
        set_cookie("token", null)
        set_cookie("token", token)
        page_data.alerts.create_alert("success", "Login Successful")
        mixpanel.track("Authenticate", {
            mode: "login",
            method: "email_password"
        })
        await invalidateAll()
    } catch (error) {
        console.error(error)
        mixpanel.track("Failed Authenticate", {
            mode: "login",
            method: "email_password",
            error: error,
        })
        page_data.alerts.create_alert("error", error)
        throw new Error("Failed to login")
    }
}