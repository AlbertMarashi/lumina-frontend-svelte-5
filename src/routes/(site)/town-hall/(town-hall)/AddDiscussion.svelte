<script lang="ts">
import { invalidate } from "$app/navigation"
import { page } from "$app/stores"
import CleanTextInput from "$lib/controls/CleanTextInput.svelte"
import Hashtag from "$lib/controls/Hashtag.svelte"
import Segment from "$lib/controls/Segment.svelte"
import FlexWrap from "$lib/display/FlexWrap.svelte"
import Label from "$lib/display/Label.svelte"
import {AddStatementQuery, VoteForStatementQuery} from "$lib/queries/surreal_queries"
import { safe_db } from "$lib/stores/database"
import CommentPlus from "svelte-material-icons/CommentPlus.svelte"
import { SvelteSet } from "svelte/reactivity"

let {
    onclose,
    tags,
}: {
    onclose: () => void,
    tags: string[],
} = $props()

let with_tags = $state(new SvelteSet<string>())
let content = $state("")
let textinput: CleanTextInput = $state(undefined! as CleanTextInput)

export function focus() {
    textinput.focus()
}

async function add_statement() {
    try {
        if (with_tags.size === 0) return $page.data.alerts.create_alert("error", "You must add at least one tag")
        if (with_tags.size > 3) return $page.data.alerts.create_alert("error", "You can only add up to 3 tags")

        const db = await safe_db()

        let [[statement]] = await db.typed(AddStatementQuery, {
            statement: {
                content,
                tags: [...with_tags]
            }
        })

        console.log(statement)

        if (!statement) return $page.data.alerts.create_alert("error", "Could not create statement")

        // vote for the statement
        let [[vote]] = await db.typed(VoteForStatementQuery, {
            vote: {
                rating: 4,
                statement: statement.id,
            }
        })

        if (!vote) return $page.data.alerts.create_alert("error", "Could not vote for your new statement")

        await invalidate("app:statements")
        $page.data.alerts.create_alert("success", "Statement added")
        onclose()
    } catch (e) {
        return $page.data.alerts.create_alert("error", e)
    }
}
</script>
<add-statement
    onclick={textinput.focus}
    role="presentation">
    <CleanTextInput
        bind:this={ textinput }
        label="Statement"
        placeholder="Should be a short, clear, and concise statement. For example: 'Should we require identity verification to vote?'"
        bind:value={ content }
    />
    <Label text="Tags"/>
    <FlexWrap align="center">
        {#each tags as tag}
            <Hashtag
                active={with_tags.has(tag)}
                onclick={() => with_tags.has(tag) ? with_tags.delete(tag) : with_tags.add(tag)}
                text={tag}/>
        {/each}
    </FlexWrap>
    <description>
        Add at least one tag
    </description>
    <Segment
        style="branded"
        disabled={!content}
        left_icon={CommentPlus}
        left_icon_opacity={1}
        onclick={add_statement}
        text="Add Discussion"/>
</add-statement>
<style>
add-statement {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    background: var(--background);
    border-radius: 8px;
}

description {
    font-size: 14px;
    color: rgba(var(--foreground-rgb), 0.6);
    font-style: italic;
}
</style>