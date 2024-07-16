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

</script>

<svelte:head>
    <link
        href="/manifest.json"
        rel="manifest">
    <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-8MK9JSEJ2P"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-8MK9JSEJ2P');
    </script>
</svelte:head>
<div class="app">
    <Sidebar
        bind:user={ data.user }
        bind:sidebar_opened
        bind:dropdown/>
    <div
        bind:this={ content }
        class="content">
        <Header
            bind:sidebar_opened
            bind:dropdown
            bind:user={ data.user }/>
        <main>
            {@render children()}
        </main>
        <AppBar
            bind:dropdown
            bind:sidebar_opened
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
main {
    flex: 1;
}
.popout {
    max-width: 400px;
    width: 100%;
}
</style>