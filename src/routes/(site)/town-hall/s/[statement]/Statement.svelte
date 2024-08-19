<script lang="ts">
import RatingBar from "$lib/controls/RatingBar.svelte"
import Icon from "$lib/display/Icon.svelte"
import AccountCircle from "svelte-material-icons/AccountCircle.svelte"
import DotsHorizontal from "svelte-material-icons/DotsHorizontal.svelte"
import Comment from "svelte-material-icons/Comment.svelte"
import CommentOutline from "svelte-material-icons/CommentOutline.svelte"
import Tag from "$lib/display/Tag.svelte"
import RatingModal from "./RatingModal.svelte"
import {receive, send} from "./crossfade_statement.svelte"
import GenericDropdown from "$lib/controls/GenericDropdown.svelte"
import Hashtag from "$lib/controls/Hashtag.svelte"
import FlexWrap from "$lib/display/FlexWrap.svelte"
import Expand from "svelte-material-icons/ArrowExpand.svelte"
import { is_record_id, type RecordId } from "$lib/pojo_surreal"

type Statement = {
    id: RecordId<"statement">,
    replying_to?: RecordId<"statement"> | Statement,
    tags?: string[],
    vote_data?: {
        rating_avg: number,
        total_votes: number,
        score: number,
    },
    created_at: Date,
    author_data?: {
        author_name: string,
        id: RecordId<"statement_author_data">,
    },
    // will always be "support" or "against"
    side?: "support" | "against" | string,
    total_replies?: number,
    my_rating?: {
        id: RecordId<"statement_vote">,
        rating: number,
    },
    content: string,
}

let {
    statement,
    scale = 1,
}: {
    scale?: number,
    statement: Statement
} = $props()

let show_rating_ui = $state(false)
</script>
{#if statement.replying_to && !(is_record_id(statement.replying_to))}
    <svelte:self
        scale={scale * 0.9}
        statement={statement.replying_to}/>
{/if}
<statement
    style:--side-color-rgb={ statement.replying_to ? statement.side === "support" ? "var(--green-rgb)" : "var(--red-rgb)" : undefined }
    style:zoom={ scale }
    in:send={ { key: statement.id.id } }
    out:receive={ { key: statement.id.id } }>
    {#if show_rating_ui}
        <RatingModal
            statement={statement}
            bind:show_rating_ui={ show_rating_ui }
            bind:my_rating={ statement.my_rating }/>
    {/if}
    <inner>
        <top>
            <RatingBar
                bind:my_rating={ statement.my_rating }
                bind:vote_data={ statement.vote_data }
                bind:show_rating_ui={ show_rating_ui }/>
            <right>
                <a
                    class="statement-button"
                    href="/town-hall/s/{statement.id.id}"

                    onclick={e => e.stopPropagation()}>
                    <Icon icon={Expand}/>
                </a>
                <a
                    class="statement-button"
                    href="/town-hall/s/{statement.id.id}"
                    onclick={e => e.stopPropagation()}>
                    { statement.total_replies || "" }
                    <Icon icon={(statement.total_replies || 0) ? Comment : CommentOutline} />
                </a>
                <!-- <button>
                { statement.laughs || null }
                <Icon icon={Emoticon} />
            </button> -->
                <GenericDropdown position="bottom-right">
                    {#snippet element({ toggle })}
                    <button
                        class="statement-button"
                        onclick={toggle}>
                        <Icon icon={DotsHorizontal} />
                    </button>
                    {/snippet}
                    {#snippet dropdown()}
                        <div class="dropdown">
                            Nothing here yet
                        </div>
                    {/snippet}
                </GenericDropdown>
            </right>
        </top>
        <content>
            { statement.content }
        </content>
        <bottom>
            <author>
                <Icon icon={AccountCircle} />
                { statement.author_data!.author_name }
            </author>
            <Tag
                --color="rgba(var(--foreground-rgb), 0.8)"
                opacity={true}
                text="Citizen" />
        </bottom>
        {#if statement.tags}
            <FlexWrap>
                {#each statement.tags as tag}
                    <Hashtag
                        active={true}
                        text={tag}/>
                {/each}
            </FlexWrap>
        {/if}
    </inner>
</statement>
<style>

statement {
    --side-color: rgba(var(--side-color-rgb), 1);
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    background: var(--background);
    width: 100%;
    max-width: 800px;
    border: 1px solid rgba(var(--foreground-rgb), 0.1);
    inner {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
}

content {
    color: rgba(var(--foreground-rgb), 0.8);
    font-size: 16px;
}

bottom {
    display: flex;
    gap: 8px;
    position: relative;
    align-items: center;
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

.dropdown {
    padding: 16px;
}

.statement-button {
    display: flex;
    gap: 6px;
    padding: 8px 8px;
    font-size: 14px;
    align-items: center;
    outline: none;
    color: rgba(var(--foreground-rgb), 0.5);
    border-radius: 4px;
    line-height: 100%;;
    --size: 16px;
    &:hover, &:focus {
        color: rgba(var(--foreground-rgb), 0.8);
        background: rgba(var(--foreground-rgb), 0.1);
    }
}
</style>