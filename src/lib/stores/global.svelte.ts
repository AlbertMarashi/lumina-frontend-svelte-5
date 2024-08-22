import { set_cookie } from "$lib/utils/cookie"
import { safe_state } from "safe-ssr"

export const global_state = safe_state("global_state", {
    loading: false,
    dark_mode: true,
})

export function toggle_theme() {
    console.log("toggle theme", global_state.inner.dark_mode)
    global_state.inner.dark_mode = !global_state.inner.dark_mode
    set_cookie("dark_mode", global_state.inner.dark_mode ? "true" : "false")
}
