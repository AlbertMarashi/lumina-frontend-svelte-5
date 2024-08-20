<script lang="ts">
import Button from "$lib/controls/Button.svelte"
import Hashtag from "$lib/controls/Hashtag.svelte"
import Segment from "$lib/controls/Segment.svelte"
import FlexWrap from "$lib/display/FlexWrap.svelte"
import Alert from "svelte-material-icons/Alert.svelte"
import Clock from "svelte-material-icons/Clock.svelte"
import RocketLaunch from "svelte-material-icons/RocketLaunch.svelte"
import Plus from "svelte-material-icons/Plus.svelte"
import type { ComponentProps } from "svelte"
import Statement from "./s/[statement]/Statement.svelte"
import Heading from "$lib/display/Heading.svelte"
import Capitol from "$lib/icons/Capitol.svelte"
import AddDiscussion from "./AddDiscussion.svelte"
import GenericScrimPopout from "$lib/controls/GenericScrimPopout.svelte"
import { page } from "$app/stores"
import { SvelteSet } from "svelte/reactivity"
import auth_guard from "$lib/utils/auth_guard"
import PageHead from "$lib/components/PageHead.svelte"

let {
    data
} = $props()

let tab: "best" | "new" | "controversial" = $state("best")

let tags = [
    "politics",
    "town-hall",
    "systems",
    "economy",
    "environment",
    "health",
    "education",
    "culture",
    "science",
    "technology",
    "law"
]

let active_tags = $derived(new SvelteSet($page.url.searchParams.get("tag")?.split(",")))

const filters = [
    {
        name: "Best",
        slug: "best",
        icon: RocketLaunch,
    },
    {
        name: "New",
        slug: "new",
        icon: Clock,
    },
    {
        name: "Controversial",
        slug: "controversial",
        icon: Alert,
    },
// {
    //     name: "Funny",
    //     slug: "funny",
    //     icon: Emoticon,
    // }
] as const


function sort_by(type: typeof tab,  statements: ComponentProps<Statement>["statement"][]): ComponentProps<Statement>["statement"][] {
    if (type === "best") return statements.sort((a, b) => (b.vote_data?.score || 0) - (a.vote_data?.score || 0))
    if (type === "new") return statements.sort((a, b) => b.created_at.getTime() - a.created_at.getTime())

    // if (type === "controversial")
    return statements.sort((a, b) => {
        let normalised_a = (a.vote_data?.rating_avg || 0) / 4
        let normalised_b = (b.vote_data?.rating_avg || 0) / 4
        let a_distance = Math.min(normalised_a, 1 - normalised_a)
        let b_distance = Math.min(normalised_b, 1 - normalised_b)

        let a_controversy = a_distance * (a.vote_data?.total_votes || 0)
        let b_controversy = b_distance * (b.vote_data?.total_votes || 0)

        return b_controversy - a_controversy
    })
}

</script>
<PageHead
    description="enabling citizens to debate and vote online, ensuring every citizen's voice has a say in the direction of our society."
    title="Town Hall"/>
<section>
    <inner class="justify horizontal">
        <Heading
            left_icon={Capitol}
            text="Town Hall" />
        <GenericScrimPopout>
            {#snippet element({ toggle})}
            <Button
                style="translucent"
                label="New Discussion"
                onclick={auth_guard(toggle)}
                right_icon={Plus} />
            {/snippet}
            {#snippet dropdown({close})}
                <AddDiscussion
                    onclose={close}
                    tags={tags}/>
            {/snippet}
        </GenericScrimPopout>
    </inner>
</section>
<section>
    <inner>
        <FlexWrap justify="center">
            {#each tags as tag}
                <Hashtag
                    active={active_tags.has(tag)}
                    text={tag}/>
            {/each}
        </FlexWrap>
    </inner>
</section>
<section>
    {#if data.statements.length}
        <inner class="center">
            <FlexWrap>
                {#each filters as filter}
                    <Segment
                        style={filter.slug === tab ? "translucent" : "outline"}
                        left_icon={filter.icon}
                        onclick={() => tab = filter.slug}
                        text={filter.name}/>
                {/each}
            </FlexWrap>
            <statements>
                {#each sort_by(tab, data.statements) as statement, i}
                    <Statement
                        show_rating_ui={i === 0 && statement.my_rating === undefined}
                        statement={statement}/>
                {/each}
            </statements>
        </inner>
    {:else}
        <no-statements>
            No discussions found, add one!
        </no-statements>
    {/if}
</section>
<style>
section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    padding: 24px;
    width: 100%;
    border-bottom: 1px solid rgba(var(--foreground-rgb), 0.1);
    &:last-child {
        border-bottom: none;
    }
}

inner {
    display: flex;
    flex-direction: column;
    max-width: 1000px;
    gap: 24px;
    width: 100%;
    &.center {
        align-items: center;
    }
    &.justify {
        justify-content: space-between;
    }
    &.horizontal {
        flex-direction: row;
    }
}

statements {
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
    align-items: center;
}

no-statements {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    font-size: 18px;
    font-style: italic;
    color: rgba(var(--foreground-rgb), 0.6);
    border: 1px solid rgba(var(--foreground-rgb), 0.1);
    border-radius: 8px;
    padding: 10px 16px;
}
</style>
