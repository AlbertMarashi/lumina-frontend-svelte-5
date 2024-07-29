<script lang="ts">
import { PUBLIC_BUILDERIO_KEY } from "$env/static/public"
import ButtonComponent from "$lib/blocks/Button/ButtonComponent"
import HeadingComponent from "$lib/blocks/Heading/HeadingComponent.js"
import IconComponent from "$lib/blocks/Icon/IconComponent.js"
import MarkdownComponent from "$lib/blocks/Markdown/MarkdownComponent.js"
import SpecialComponent from "$lib/blocks/Special/SpecialComponent.js"
import TagComponent from "$lib/blocks/TagComponent/TagComponent.js"
import PageHead from "$lib/components/PageHead.svelte"
import { icons } from "$lib/data/icons.svelte"
import Author from "$lib/display/Author.svelte"
import DateComponent from "$lib/display/Date.svelte"
import FlexWrap from "$lib/display/FlexWrap.svelte"
import Heading from "$lib/display/Heading.svelte"
import Tag from "$lib/display/Tag.svelte"
import { Content, isPreviewing } from "@builder.io/sdk-svelte"

let {
    data,
} = $props()

Object.assign(icons, data.icons)

</script>
<PageHead
    description={data.description}
    title={data.title || "Untitled Page"}
    type="article"/>
<main>
    <FlexWrap>
        {#each data.content?.data?.tags || [] as tag}
            <Tag text={tag.tag}/>
        {/each}
    </FlexWrap>
    <Heading text={data.content?.data?.title || "Untitled Page"}/>
    <DateComponent date={new Date(data.content?.data?.datePublished || "")}/>
    <Author
        name="Lumina Government"
        src="/images/lumina.png"/>
    <article>
        <inner>
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
                        MarkdownComponent,
                    ]}
                    data={{}}
                    model="press-releases" />
            {:else}
                <h1>No Content</h1>
            {/if}
        </inner>
    </article>
</main>
<style>

main {
    display: flex;
    flex-direction: column;
    padding: 32px;
    gap: 12px;
    max-width: 1000px;
    margin: 0 auto;
}

article {
    display: flex;
    flex-direction: column;
    padding: 24px;
    background: rgba(var(--foreground-rgb), 0.05);
    border-radius: 8px;
}

inner {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-width: 600px;
    margin: 0 auto;
    width: 100%;
}
</style>