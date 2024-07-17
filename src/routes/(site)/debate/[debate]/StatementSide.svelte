<script lang="ts">
import type { ComponentProps } from "svelte"
import Statement from "./Statement.svelte"
import Segment from "$lib/controls/Segment.svelte"
import Plus from "svelte-material-icons/Plus.svelte"


let {
    statements,
    side,
}: {
    statements: ComponentProps<Statement>["statement"][],
    side: "support" | "against",
} = $props()

let side_colors = {
    support: "var(--green-rgb)",
    against: "var(--red-rgb)"
}

let title = {
    "support": "In Support",
    "against": "In Opposition",
}

</script>
<side style:--side-color-rgb={ side_colors[side] }>
    <heading-area>
        <top>
            <side-tag>{ title[side] }</side-tag>
            <Segment
                style="translucent"
                left_icon={Plus}
                onclick={() => {}}/>
        </top>
    </heading-area>
    <statements>
        {#each statements as statement}
            <Statement statement={statement} />
        {/each}
    </statements>
</side>
<style>
side {
    --side-color: rgba(var(--side-color-rgb), 1);
    display: flex;
    flex-direction: column;
    background: rgba(var(--foreground-rgb), 0.03);
    border: 1px solid rgba(var(--foreground-rgb), 0.1);
    border-radius: 16px;
    flex: 1;
}

heading-area {
    border-bottom: 1px solid rgba(var(--foreground-rgb), 0.1);
    display: flex;
    flex-direction: column;
    padding: 16px;
    gap: 16px;
}

side-tag {
    font-size: 16px;
    text-transform: uppercase;
    background: rgba(var(--side-color-rgb), 0.12);
    padding: 8px;
    line-height: 100%;
    font-weight: 700;
    color: rgba(var(--side-color-rgb), 1);
    border-radius: 4px;
}

top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
}

statements {
    display: flex;
    flex-direction: column;
    padding: 16px;
    gap: 16px;
}
</style>