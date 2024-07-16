<script lang="ts">
import "./global.css"
import "./variables.css"
import "./normalise.css"
import AlertBar from "./AlertBar.svelte"
import PageLoaderBar from "./PageLoaderBar.svelte"
import { afterNavigate } from "$app/navigation"
import { page } from "$app/stores"
import OverlayLoading from "$lib/display/OverlayLoading.svelte"
import { global_state } from "$lib/stores/global.svelte"

let {
    data,
    children,
} = $props()

afterNavigate(() => {
    data.mixpanel.track_pageview({
        route: $page.route.id
    })
})
</script>
<div
    class="wrapper"
    class:light_mode={ !global_state.dark_mode }>

    <PageLoaderBar/>
    <AlertBar/>

    {#if global_state.loading}
        <OverlayLoading position="fixed"/>
    {/if}
    {@render children()}
</div>
<style>

.wrapper {
    background: var(--background);
    color: var(--foreground);
    flex: 1;
    display: flex;
    flex-direction: column;
    max-height: 100%;
    height: 100%;
    overflow-y: auto;
}

.light_mode {
    --background-rgb: 242, 240, 245;
    --background: rgb(var(--background-rgb));

    --foreground-rgb: 16, 14, 18;
    --foreground: rgb(var(--foreground-rgb));
}
</style>
