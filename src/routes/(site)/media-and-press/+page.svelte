<script lang="ts">
import { PUBLIC_BUILDERIO_KEY } from "$env/static/public"
import ButtonComponent from "$lib/blocks/Button/ButtonComponent"
import HeadingComponent from "$lib/blocks/Heading/HeadingComponent.js"
import IconComponent from "$lib/blocks/Icon/IconComponent.js"
import SpecialComponent from "$lib/blocks/Special/SpecialComponent.js"
import TagComponent from "$lib/blocks/TagComponent/TagComponent.js"
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
            customComponents={[
                ButtonComponent,
                SpecialComponent,
                TagComponent,
                HeadingComponent,
                IconComponent,
            ]}
            data={{
                citizen: data.user?.has_citizenship_application,
                site_data,
                press_releases: data.press_releases,
            }}
            model="page" />
    {:else}
        <h1>No Content</h1>
    {/if}
</main>