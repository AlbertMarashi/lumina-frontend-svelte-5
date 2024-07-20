<script lang="ts">
import RatingBar from "$lib/controls/RatingBar.svelte"
import Icon from "$lib/display/Icon.svelte"
import AccountCircle from "svelte-material-icons/AccountCircle.svelte"
import DotsHorizontal from "svelte-material-icons/DotsHorizontal.svelte"
import Comment from "svelte-material-icons/Comment.svelte"
// import Emoticon from "svelte-material-icons/Emoticon.svelte"
import Tag from "$lib/display/Tag.svelte"
import type { RecordId } from "surrealdb.js"

interface Statement {
    id: RecordId<"statement">,
    replying_to?: Statement | RecordId<"statement">,
    side?: "support" | "against"
    author: RecordId<"user">,
    content: string,
    created_at: Date
}

interface ScoredStatement {
    statement: Statement,
    score: number,
    rating_avg: number,
    total_votes: number,
    total_replies: number
}

let {
    scored_statement,
    scale = 1,
}: {
    scale?: number,
    scored_statement: ScoredStatement
} = $props()

</script>
<!-- {#if statement.statement.replying_to}
    <svelte:self
        scale={scale * 0.9}
        statement={statement.statement.replying.to}/>
{/if} -->
<statement
    style:--side-color-rgb={ scored_statement.statement.replying_to ? scored_statement.statement.side === "support" ? "var(--green-rgb)" : "var(--red-rgb)" : undefined }
    style:zoom={ scale }>
    <top>
        <RatingBar rating={scored_statement.rating_avg} />
        <right>
            <button>
                { scored_statement.total_replies }
                <Icon icon={Comment} />
            </button>
            <!-- <button>
                { statement.laughs || null }
                <Icon icon={Emoticon} />
            </button> -->
            <button>
                <Icon icon={DotsHorizontal} />
            </button>
        </right>
    </top>
    <content>
        { scored_statement.statement.content }
    </content>
    <bottom>
        <author>
            <Icon icon={AccountCircle} />
            { scored_statement.statement.author }
        </author>
        <Tag
            --color="var(--foreground)"
            opacity={true}
            text="Citizen" />
    </bottom>
</statement>
<style>

statement {
    --side-color: rgba(var(--side-color-rgb), 1);
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 16px;
    border-radius: 8px;
    background: var(--background);
    width: 100%;
    max-width: 800px;
    border: 1px solid rgba(var(--foreground-rgb), 0.1);
}

content {
    color: rgba(var(--foreground-rgb), 0.8);
    font-size: 16px;
}
author {
    color: rgba(var(--foreground-rgb), 0.8);
    --color: rgba(var(--foreground-rgb), 0.5);
    --size: 18px;
    display: flex;
    gap: 6px;
    font-size: 16px;
    font-weight: 500;
    align-items: center;
}

bottom {
    display: flex;
    gap: 8px;
    align-items: center;
}

top {
    display: flex;
    gap: 4px;
    margin: -3px 0;
    align-items: center;
    justify-content: space-between;
    right {
        display: flex;
        align-items: center;
    }
}

button {
    display: flex;
    gap: 6px;
    padding: 5px 6px;
    font-size: 14px;
    align-items: center;
    color: rgba(var(--foreground-rgb), 0.5);
    border-radius: 4px;
    line-height: 100%;;
    --size: 16px;
    &:hover {
        color: rgba(var(--foreground-rgb), 0.8);
        background: rgba(var(--foreground-rgb), 0.1);
    }
}
</style>