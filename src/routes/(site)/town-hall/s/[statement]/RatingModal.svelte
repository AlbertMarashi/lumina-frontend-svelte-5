<script lang="ts">
import { UpdateStatementVoteQuery, VoteForStatementQuery } from "$lib/queries/surreal_queries"
import type { ComponentProps } from "svelte"
import type Statement from "./Statement.svelte"
import Icon from "$lib/display/Icon.svelte"
import Info from "svelte-material-icons/Information.svelte"
import { safe_db } from "$lib/stores/database"
import { page } from "$app/stores"
import type { RecordId } from "surrealdb.js"
import { invalidate } from "$app/navigation"

let {
    statement,
    my_rating = $bindable(),
    show_rating_ui = $bindable(),
}: {
    statement: ComponentProps<Statement>["statement"],
    my_rating?: {
        id: RecordId<"statement_vote">,
        rating: number,
    },
    show_rating_ui: boolean,
} = $props()

async function vote(rating: number) {
    try {
        const db = await safe_db()

        if (!my_rating) {
            const [[vote]] = await db.typed(VoteForStatementQuery, {
                vote: {
                    statement: statement.id,
                    rating,
                }
            })

            if (!vote) return $page.data.alerts.create_alert("error", "Failed to vote")

            my_rating = { id: vote.id, rating }
            await invalidate("app:statements")
            show_rating_ui = false

            $page.data.alerts.create_alert("success", "Voted successfully")
        } else {
            const [[vote]] = await db.typed(UpdateStatementVoteQuery, {
                vote: my_rating.id,
                rating,
            })

            if (!vote) return $page.data.alerts.create_alert("error", "Failed to update vote")

            my_rating = { id: vote.id, rating }
            await invalidate("app:statements")
            show_rating_ui = false

            $page.data.alerts.create_alert("success", "Updated vote successfully")
        }
    } catch (e) {
        console.error(e)
        $page.data.alerts.create_alert("error", e)
    }
}

$inspect(my_rating)
</script>
<rating-modal>
    <description>
        <Icon icon={Info}/>
        Rate the impact of this statement
    </description>
    <rating-clickers>
        {#each Array(5) as _, i}
            <button
                class="clicker i_{i}"
                class:selected={ i === my_rating?.rating }
                onclick={() => vote(i)}
                onkeydown={e => {
                    if (e.key === "Enter") vote(i)
                }}
                tabindex="0">
                <circle-item>
                    { i }
                </circle-item>
            </button>
        {/each}
    </rating-clickers>
</rating-modal>
<style>

rating-modal {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid rgba(var(--foreground-rgb), 0.1);
    description {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        font-size: 15px;
        --size: 15px;
        line-height: 100%;
        font-style: italic;
        color: rgba(var(--foreground-rgb), 0.5);
    }
}

rating-clickers {
    display: flex;
}

.clicker {
    display: flex;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    flex: 1;
    padding: 10px 0;
    &.i_0 {
        background: rgba(var(--side-color-rgb, var(--foreground-rgb)), 0.1);
    }
    &.i_1 {
        background: rgba(var(--side-color-rgb, var(--foreground-rgb)), 0.2);
    }
    &.i_2 {
        background: rgba(var(--side-color-rgb, var(--foreground-rgb)), 0.3);
    }
    &.i_3 {
        background: rgba(var(--side-color-rgb, var(--foreground-rgb)), 0.4);
    }
    &.i_4 {
        background: rgba(var(--side-color-rgb, var(--foreground-rgb)), 0.5);
    }
    &.selected {
        background: rgba(var(--side-color-rgb, var(--foreground-rgb)), 0.6);
        outline: 4px solid rgba(var(--side-color-rgb, var(--foreground-rgb)), 0.5);
        outline-offset: -4px;
    }
    circle-item {
        display: flex;
        padding: 2px;
        border-radius: 100px;
        height: 28px;
        width: 28px;
        justify-content: center;
        align-items: center;
        background: rgba(var(--background-rgb), 1);
        color: rgba(var(--side-color-rgb, var(--foreground-rgb)), 0.8);
        font-weight: 600;
        border: 2px solid transparent;
    }
    &:hover, &:focus {
        circle-item {
            border: 2px solid rgba(var(--side-color-rgb, var(--foreground-rgb)), 1);
        }
    }
}
</style>