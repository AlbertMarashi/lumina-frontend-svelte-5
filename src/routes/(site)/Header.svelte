<script lang="ts">
import IconButton from "$lib/controls/IconButton.svelte"
import NotificationOutline from "svelte-material-icons/BellOutline.svelte"
import ProfileButton from "$lib/controls/ProfileButton.svelte"
import Logo from "$lib/icons/Logo.svelte"
import Apps from "svelte-material-icons/Apps.svelte"
import Menu from "svelte-material-icons/Menu.svelte"
import ExitToApp from "svelte-material-icons/ExitToApp.svelte"
import Settlement from "$lib/icons/Settlement.svelte"
import { onMount } from "svelte"
import Button from "$lib/controls/Button.svelte"
import { getNearestScrollableParent } from "$lib/utils/element_utils"
import type { GetUserResult } from "$lib/queries/surreal_queries"
import { global_state } from "$lib/stores/global.svelte"
import Moon from "svelte-material-icons/WeatherNight.svelte"
import Sun from "svelte-material-icons/WhiteBalanceSunny.svelte"

let {
    sidebar_opened = $bindable(),
    dropdown = $bindable(),
    user = $bindable()
} : {
    sidebar_opened: "default" | boolean
    dropdown: "notifications" | "account" | null
    user: GetUserResult[0][0] | null
} = $props()

let scrolled = $state(false)
let header: HTMLElement = $state()!
let nearest_vertical_scrollable_parent: Element | null = $state(null)
let authenticated = $derived(user != null)

onMount(() => {
    nearest_vertical_scrollable_parent = getNearestScrollableParent(header, "vertical")
    if(!nearest_vertical_scrollable_parent) return
    scrolled = nearest_vertical_scrollable_parent.scrollTop != 0
    nearest_vertical_scrollable_parent.addEventListener("scroll", updateScroll)
    return () => {
        if(nearest_vertical_scrollable_parent){
            nearest_vertical_scrollable_parent.removeEventListener("scroll", updateScroll)
        }
    }
})

function updateScroll() {
    scrolled = nearest_vertical_scrollable_parent?.scrollTop != 0
}


function toggle(toggling: "notifications" | "account") {
    if (toggling === dropdown) {
        dropdown = null
    } else {
        dropdown = toggling
    }
}
</script>
<header
    bind:this={ header }
    class:authenticated
    class:default={ sidebar_opened === "default" }
    class:scrolled
    class:visible={ sidebar_opened === false }>
    <div class="side">
        <IconButton
            icon={Menu}
            onclick={() => sidebar_opened = sidebar_opened === "default" ? true : !sidebar_opened}/>
        <Logo/>
    </div>
    <div class="side">
        <IconButton
            icon={global_state.dark_mode ? Moon : Sun}
            onclick={() => global_state.dark_mode = !global_state.dark_mode}/>
        {#if user}
            <IconButton
                href="/"
                icon={Apps}/>
            <IconButton
                icon={NotificationOutline}
                onclick={() => toggle("notifications")}/>
            <ProfileButton onclick={() => toggle("account")}/>
        {:else}
            <Button
                style="branded"
                href="/auth"
                label="Start"
                left_icon={ExitToApp}
                right_icon={Settlement}/>
        {/if}
    </div>
</header>
<style>
header {
    width: 100%;
    display: none;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    z-index: 8;
    background: transparent;
    box-shadow: none;
    position: sticky;
    top: 0;
    transition: box-shadow 0.1s ease-in-out, background 0.1s ease-in-out;

    & .side {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    &.visible {
        display: flex;
        border-bottom: 1px solid rgba(var(--foreground-rgb), 0.1);
        @media (max-width: 900px) {
            &.authenticated {
                display: none;
            }
        }
    }

    &.default {
        display: none;
        @media (max-width: 900px) {
            display: flex;
            &.authenticated {
                display: none;
            }
        }
    }

    &.scrolled {
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
        border: none;
        background: var(--background);
        background: color-mix(var(--background), var(--foreground) 8%, transparent);
        backdrop-filter: blur(10px);
    }
}
</style>