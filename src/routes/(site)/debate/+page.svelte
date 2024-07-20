<script lang="ts">
import { page } from "$app/stores"
import Button from "$lib/controls/Button.svelte"
import Input from "$lib/controls/Input.svelte"
import { CreateStatementQuery } from "$lib/queries/surreal_queries"
import { safe_db } from "$lib/stores/database"
import { RecordId } from "surrealdb.js"


let content: string

async function add_statement() {
    const db = await safe_db()

    // console.log(await db.query("SELECT * FROM $auth"))

    await db.typed(CreateStatementQuery, {
        statement: {
            content,
            author: new RecordId("user", $page.data.user?.id.id),
        }
    })
}
</script>

<Input
    name="Content"
    placeholder="What do you think?"
    bind:value={ content } />
<Button
    label="Create statement"
    onclick={add_statement} />