<script lang="ts">
import { PUBLIC_BUILDERIO_KEY } from "$env/static/public"
import ButtonComponent from "$lib/blocks/Button/ButtonComponent"
import HeadingComponent from "$lib/blocks/Heading/HeadingComponent.js"
import IconComponent from "$lib/blocks/Icon/IconComponent.js"
import TagComponent from "$lib/blocks/TagComponent/TagComponent.js"
import PageHead from "$lib/components/PageHead.svelte"
import { icons } from "$lib/data/icons.svelte"
import {Content, isPreviewing, type RegisteredComponent} from "@builder.io/sdk-svelte"
import Globe from "./Globe.svelte"

let {
    data,
} = $props()

Object.assign(icons, data.icons)

const GlobeComponent = {
    component: Globe,
    name: "Globe",
    // override: true,
    inputs: [],
} satisfies RegisteredComponent

</script>
<PageHead
    description={data.description}
    title={data.title || "Untitled Page"}/>

{#if data.content || isPreviewing()}
    <Content
        apiKey={PUBLIC_BUILDERIO_KEY}
        content={data.content}
        customComponents={[
            ButtonComponent,
            TagComponent,
            HeadingComponent,
            IconComponent,
            GlobeComponent,
        ]}
        data={{
            user_count: data.user_count,
        }}
        model="page" />
{:else}
    <h1>No Content</h1>
{/if}