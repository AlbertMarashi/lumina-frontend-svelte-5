<script lang="ts">
import RatingBar from "$lib/controls/RatingBar.svelte"
import Icon from "$lib/display/Icon.svelte"
import AccountCircle from "svelte-material-icons/AccountCircle.svelte"
import DotsHorizontal from "svelte-material-icons/DotsHorizontal.svelte"
import Comment from "svelte-material-icons/Comment.svelte"
import CommentOutline from "svelte-material-icons/CommentOutline.svelte"
import Tag from "$lib/display/Tag.svelte"
import RatingModal from "./RatingModal.svelte"
import GenericDropdown from "$lib/controls/GenericDropdown.svelte"
import Hashtag from "$lib/controls/Hashtag.svelte"
import FlexWrap from "$lib/display/FlexWrap.svelte"
import CommentCheck from "svelte-material-icons/CommentCheck.svelte"
import CommentRemove from "svelte-material-icons/CommentRemove.svelte"
import CheckCircle from "svelte-material-icons/CheckCircle.svelte"
import { is_record_id, type RecordId } from "$lib/pojo_surreal"
import { page } from "$app/stores"
import { goto } from "$app/navigation"
import stop_propagation from "$lib/utils/stop_propagation"
import NoPropagate from "$lib/controls/NoPropagate.svelte"

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
    side?: "support" | "against" | string,
    total_replies?: number,
    my_rating?: {
        id: RecordId<"statement_vote">,
        rating: number,
    },
    content: string,
}

let {
    statement = $bindable(),
    show_rating_ui = $bindable(false),
    scale = 1,
}: {
    scale?: number,
    show_rating_ui?: boolean,
    statement: Statement
} = $props()

let interactive = $derived($page.url.pathname !== `/town-hall/s/${statement.id.id}`)

function handleClick() {
    if (!interactive) return

    // Check if there's any selected text
    const selection = window.getSelection()
    if (selection && selection.toString().trim().length > 0) {
        // Text is selected, do not navigate
        return
    }

    // No text selected, proceed with navigation
    goto("/town-hall/s/" + statement.id.id)
}


</script>
{#if statement.replying_to && !(is_record_id(statement.replying_to))}
    <svelte:self
        scale={scale * 0.9}
        statement={statement.replying_to}/>
{/if}
<statement
    style:--side-color-rgb={ statement.replying_to ? statement.side === "support" ? "var(--green-rgb)" : "var(--red-rgb)" : undefined }
    style:zoom={ scale }>
    {#if show_rating_ui}
        <RatingModal
            my_rating={statement.my_rating}
            statement={statement}
            bind:show_rating_ui={ show_rating_ui }/>
    {/if}
    <inner
        class:interactive={ interactive }
        onclick={handleClick}
        role="presentation">
        <top>
            <NoPropagate>
                <RatingBar
                    vote_data={statement.vote_data}
                    bind:show_rating_ui={ show_rating_ui }/>
            </NoPropagate>
            <right>
                <a
                    class="statement-button"
                    href="/town-hall/s/{statement.id.id}">
                    <Icon icon={(statement.total_replies || 0) ? Comment : CommentOutline} />
                    { statement.total_replies || "0" }
                </a>
                <GenericDropdown position="bottom-right">
                    {#snippet element({ toggle })}
                            <button
                                class="statement-button"
                                onclick={stop_propagation(toggle)}>
                                <Icon icon={DotsHorizontal} />
                            </button>
                        {/snippet}
                    {#snippet dropdown({ close })}
                        {#if !show_rating_ui}
                            <NoPropagate>
                                <button
                                    class="option"
                                    onclick={() => {
                                        close()
                                        show_rating_ui = true
                                    }}>
                                    <Icon icon={CheckCircle}/> Rate this statement
                                </button>
                            </NoPropagate>
                        {/if}
                        <a
                            class="option"
                            href="/town-hall/s/{statement.id.id}?replying=support"
                            onclick={close}>
                            <Icon icon={CommentCheck}/> Reply <Tag
                                --color="var(--green)"
                                text="In Support"/>
                        </a>
                        <a
                            class="option"
                            href="/town-hall/s/{statement.id.id}?replying=against"
                            onclick={close}>
                            <Icon icon={CommentRemove}/> Reply <Tag
                                --color="var(--red)"
                                text="In Opposition"/>
                        </a>
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
                <NoPropagate>
                    {#each statement.tags as tag}
                        <Hashtag
                            active={true}
                            text={tag}/>
                    {/each}
                </NoPropagate>
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
        &.interactive {
            cursor: pointer;
            &:hover {
                background: rgba(var(--foreground-rgb), 0.02);
            }
        }
    }
}

content {
    color: rgba(var(--foreground-rgb), 0.8);
    font-size: 16px;
    font-weight: 500;
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

.option {
    --size: 20px;
    --opacity: 0.5;
    padding: 0 12px;
    height: 46px;
    color: rgba(var(--foreground-rgb), 1);
    display: flex;
    font-weight: 600;
    gap: 8px;
    align-items: center;
    cursor: pointer;
    /* border-bottom: 1px solid rgba(var(--foreground-rgb), 0.1); */
    &:hover {
        background: rgba(var(--foreground-rgb), 0.05);
    }
    &:last-child {
        border-bottom: none;
    }
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
    --size: 18px;
    &:hover, &:focus {
        color: rgba(var(--foreground-rgb), 0.8);
        background: rgba(var(--foreground-rgb), 0.1);
    }
}
</style>