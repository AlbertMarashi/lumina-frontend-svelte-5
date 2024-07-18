<script lang="ts">
import Statement from "./Statement.svelte"
import StatementSide from "./StatementSide.svelte"
import FlexWrap from "$lib/display/FlexWrap.svelte"
import Segment from "$lib/controls/Segment.svelte"
import RocketLaunch from "svelte-material-icons/RocketLaunch.svelte"
import Alert from "svelte-material-icons/Alert.svelte"
import Emoticon from "svelte-material-icons/Emoticon.svelte"
import Clock from "svelte-material-icons/Clock.svelte"
import type { ComponentProps } from "svelte"

let { data } = $props()

let tab: "best" | "new" | "controversial" | "funny" = $state("best")
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
    {
        name: "Funny",
        slug: "funny",
        icon: Emoticon,
    }
] as const

</script>
<debate>
    <section>
        <Statement statement={data.debate.current as ComponentProps<Statement>["statement"]} />
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
                statements={data.debate.support as ComponentProps<Statement>["statement"][]}/>
            <StatementSide
                side="against"
                statements={data.debate.against as ComponentProps<Statement>["statement"][]}/>
        </sides>
    </section>
</debate>
<style>

debate {
    display: flex;
    flex-direction: column;
    align-items: center;
}

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