import { global_state } from "$lib/stores/global"

export async function load({ cookies }) {
    if(cookies.get("dark_mode") === "false") {
        global_state.inner.dark_mode = false
    } else {
        global_state.inner.dark_mode = true
    }
}
