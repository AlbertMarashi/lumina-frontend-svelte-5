<script lang="ts">
import AppBar from "./AppBar.svelte"
import Sidebar from "./Sidebar.svelte"
import Header from "./Header.svelte"
import Scrim from "$lib/controls/Scrim.svelte"
import NotificationsPopout from "./NotificationsPopout.svelte"
import AccountPopout from "./AccountPopout.svelte"
import { afterNavigate } from "$app/navigation"
import type { LayoutData } from "./$types"
import type { Snippet } from "svelte"

let {
    data,
    children
}: {
    data: LayoutData,
    children: Snippet
} = $props()

let sidebar_opened: "default" | boolean = $state("default")
let dropdown: "notifications" | "account" | null = $state(null)
let content: HTMLElement = $state()!

afterNavigate(() => {
    dropdown = null
    sidebar_opened = "default"
    content.scrollTo({
        behavior: "instant",
        top: 0,
    })
})

import { register } from "@builder.io/sdk-svelte"

register("editor.settings", {
    designTokens: {
        colors: [
            {
                name: "Foreground",
                value: "var(--foreground)"
            },
            {
                name: "Foreground 65",
                value: "rgba(var(--foreground-rgb), 0.65)"
            },
            {
                name: "Foreground 10",
                value: "rgba(var(--foreground-rgb), 0.1)"
            },
            {
                name: "Foreground 05",
                value: "rgba(var(--foreground-rgb), 0.05)"
            },
            {
                name: "Background",
                value: "var(--background)"
            },
            {
                name: "Brand",
                value: "var(--brand)"
            },
            {
                name: "Brand RGB",
                value: "var(--brand-rgb)"
            },
            {
                name: "Red",
                value: "var(--red)"
            },
            {
                name: "Red RGB",
                value: "var(--red-rgb)"
            },
        ],
        spacing: [
            {
                name: "None",
                value: "0"
            },
            {
                name: "Padding 8px",
                value: "8px"
            },
            {
                name: "Padding 12px",
                value: "12px"
            },
            {
                name: "Padding 16px",
                value: "16px"
            },
            {
                name: "Padding 24px",
                value: "24px"
            },
            {
                name: "Padding 32px",
                value: "32px"
            },
        ],
        fontFamily: false,
        maxWidth: [
            {
                name: "Small",
                value: "600px"
            },
            {
                name: "Medium",
                value: "1000px"
            },
            {
                name: "Large",
                value: "1200px"
            },
        ],
        // border: [
        //     { name: "Border", value: "1px solid rgba(var(--foreground-rgb), 0.1)" },
        // ],
        borderRadius: [
            {
                name: "None",
                value: "0"
            },
            {
                name: "Small",
                value: "4px"
            },
            {
                name: "Medium",
                value: "8px"
            },
            {
                name: "Large",
                value: "16px"
            },
        ],
    },
})

</script>

<svelte:head>
    <link
        href="/manifest.json"
        rel="manifest">
    <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-8MK9JSEJ2P"></script>
    <script lang="ts">
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-8MK9JSEJ2P');
    </script>
</svelte:head>
<div class="app">
    <Sidebar
        bind:user={ data.user }
        bind:sidebar_opened={ sidebar_opened }
        bind:dropdown={ dropdown }/>
    <div
        bind:this={ content }
        class="content">
        <Header
            bind:sidebar_opened={ sidebar_opened }
            bind:dropdown={ dropdown }
            bind:user={ data.user }/>
        <inner-content>
            {@render children()}
        </inner-content>
        <AppBar
            bind:dropdown={ dropdown }
            bind:sidebar_opened={ sidebar_opened }
            bind:user={ data.user }/>
    </div>
</div>

{#if dropdown !== null && data.user}
    <Scrim close={() => dropdown = null}>
        <div class="popout">
            {#if dropdown === "notifications"}
                <NotificationsPopout/>
            {/if}
            {#if dropdown === "account"}
                <AccountPopout bind:user={ data.user }/>
            {/if}
        </div>
    </Scrim>
{/if}

<style>
.app {
    display: flex;
    height: 100%;
}
.content {
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    flex: 1;
}
inner-content {
    flex: 1;
}
.popout {
    max-width: 400px;
    width: 100%;
}
</style>