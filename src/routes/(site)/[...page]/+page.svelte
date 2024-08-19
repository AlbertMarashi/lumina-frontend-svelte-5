<script lang="ts">
import { PUBLIC_BUILDERIO_KEY } from "$env/static/public"
import { components } from "$lib/blocks/custom_components.js"
import PageHead from "$lib/components/PageHead.svelte"
import { icons } from "$lib/data/icons.svelte"
import site_data from "$lib/data/site_data.js"
import {Content, isPreviewing} from "@builder.io/sdk-svelte"

let {
    data,
} = $props()

Object.assign(icons, data.icons)

</script>
<PageHead
    description={data.description}
    title={data.title || "Untitled Page"}/>
<main>
    {#if data.content || isPreviewing()}
        <Content
            apiKey={PUBLIC_BUILDERIO_KEY}
            content={data.content}
            customComponents={components}
            data={{
                user: data.user,
                citizen: data.user?.has_citizenship_application,
                site_data
            }}
            model="page" />
    {:else}
        <h1>No Content</h1>
    {/if}
</main>