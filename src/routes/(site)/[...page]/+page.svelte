<script lang="ts">
import { PUBLIC_BUILDERIO_KEY } from "$env/static/public"
import ButtonComponent from "$lib/blocks/Button/ButtonComponent"
import HeadingComponent from "$lib/blocks/Heading/HeadingComponent.js"
import IconComponent from "$lib/blocks/Icon/IconComponent.js"
import SpecialComponent from "$lib/blocks/Special/SpecialComponent.js"
import TagComponent from "$lib/blocks/TagComponent/TagComponent.js"
import PageHead from "$lib/components/PageHead.svelte"
import { icons } from "$lib/data/icons.svelte"
import { Content, isPreviewing } from "@builder.io/sdk-svelte"

import { register } from "@builder.io/sdk-svelte"

register("editor.settings", {
    designTokens: {
        colors: [
            { name: "Foreground", value: "var(--foreground)" },
            { name: "Foreground 65", value: "rgba(var(--foreground-rgb), 0.65)"},
            { name: "Background", value: "var(--background)" },
            { name: "Brand", value: "var(--brand)" },
            { name: "Brand RGB", value: "var(--brand-rgb)" },
        ],
        spacing: [
            { name: "Padding Small", value: "8px" },
            { name: "Padding Medium", value: "16px" },
            { name: "Padding Large", value: "24px" },
            { name: "Padding Extra Large", value: "32px" },
        ],
        fontFamily: false,
        maxWidth: [
            { name: "Text", value: "600px" },
            { name: "Container", value: "1200px" },
        ],
        border: [
            { name: "Border", value: "1px solid rgba(var(--foreground-rgb), 0.1)" },
        ]
    },
})


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
            model="page" />
    {:else}
        <h1>No Content</h1>
    {/if}
</main>