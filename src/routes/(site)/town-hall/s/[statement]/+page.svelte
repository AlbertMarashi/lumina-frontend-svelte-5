<script lang="ts">
import Statement from "./Statement.svelte"
import StatementSide from "./StatementSide.svelte"
import FlexWrap from "$lib/display/FlexWrap.svelte"
import Segment from "$lib/controls/Segment.svelte"
import RocketLaunch from "svelte-material-icons/RocketLaunch.svelte"
import Alert from "svelte-material-icons/Alert.svelte"
import Clock from "svelte-material-icons/Clock.svelte"
import type { ComponentProps } from "svelte"
import ChevronLeft from "svelte-material-icons/ChevronLeft.svelte"
import Capitol from "$lib/icons/Capitol.svelte"
import Button from "$lib/controls/Button.svelte"

let { data } = $props()

let tab: "best" | "new" | "controversial" = $state("best")
let support_sorted = $derived(sort_by(tab, data.statement.support))
let against_sorted = $derived(sort_by(tab, data.statement.against))
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
<section>
    <inner>
        <Button
            style="translucent"
            href="/town-hall"
            label="Back to town hall"
            left_icon={ChevronLeft}
            right_icon={Capitol} />
    </inner>
</section>
<section>
    <Statement statement={data.statement as ComponentProps<Statement>["statement"]} />
</section>

<section>
    <FlexWrap>
        {#each filters as filter}
            <Segment
                style={filter.slug === tab ? "translucent" : "outline"}
                left_icon={filter.icon}
                onclick={() => tab = filter.slug}
                text={filter.name}/>
        {/each}
    </FlexWrap>
    <sides>
        <StatementSide
            side="support"
            statement={data.statement}
            statements={support_sorted}/>
        <StatementSide
            side="against"
            statement={data.statement}
            statements={against_sorted}/>
    </sides>
</section>
<style>

section {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px;
    width: 100%;
    gap: 24px;
    border-bottom: 1px solid rgba(var(--foreground-rgb), 0.1);
    &:last-child {
        border-bottom: none;
    }
}

sides {
    display: flex;
    gap: 24px;
    max-width: 1200px;
    width: 100%;
    align-items: stretch;
}
</style>