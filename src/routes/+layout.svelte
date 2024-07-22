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
import mixpanel from "mixpanel-browser"

let {
    data,
    children,
} = $props()

afterNavigate(() => {
    mixpanel.track_pageview({
        route: $page.route.id
    })
})
</script>
<div
    style:display="contents"
    class="wrapper"
    class:light_mode={ !global_state.dark_mode }>

    <PageLoaderBar/>
    <AlertBar/>

    {#if global_state.loading}
        <OverlayLoading position="fixed"/>
    {/if}
    {@render children()}
</div>
