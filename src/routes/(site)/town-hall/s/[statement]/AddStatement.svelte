<script lang="ts">
import { invalidate } from "$app/navigation"
import { page } from "$app/stores"
import CleanTextInput from "$lib/controls/CleanTextInput.svelte"
import Segment from "$lib/controls/Segment.svelte"
import {AddStatementQuery, VoteForStatementQuery} from "$lib/queries"
import { safe_db } from "$lib/stores/database"
import type { RecordId } from "$lib/pojo_surreal"
import ArrowUp from "svelte-material-icons/ArrowUp.svelte"
import auth_guard from "$lib/utils/auth_guard"

let {
    side,
    replying_to,
    onclose,
}: {
    side?: "support" | "against",
    replying_to?: RecordId<"statement">,
    onclose: () => void,
} = $props()

let content = $state("")
let textinput: CleanTextInput = $state(undefined! as CleanTextInput)

export function focus() {
    textinput.focus()
}

async function add_statement() {
    const db = await safe_db()

    let [[statement]] = await db.typed(AddStatementQuery, {
        statement: {
            content,
            side,
            replying_to
        }
    })

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
}
</script>
<add-statement
    onclick={textinput.focus}
    role="presentation">
    <CleanTextInput
        bind:this={ textinput }
        focus_on_mount={true}
        placeholder="Enter your reply here"
        bind:value={ content }
    />
    <Segment
        style="branded"
        disabled={!content}
        left_icon={ArrowUp}
        left_icon_opacity={1}
        onclick={auth_guard(add_statement)}/>
</add-statement>
<style>
add-statement {
    display: flex;
    flex-direction: row;
    gap: 16px;
    padding: 8px;
    background: var(--background);
    border-radius: 8px;
    border: 1px solid rgba(var(--foreground-rgb), 0.1);
    align-items: center;
}
</style>