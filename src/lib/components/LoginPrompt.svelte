<script lang="ts">
import { page } from "$app/stores"
import Card from "$lib/layouts/Card.svelte"
import Button from "$lib/controls/Button.svelte"
import Paragraph from "$lib/display/Paragraph.svelte"
import Settlement from "$lib/icons/Settlement.svelte"

$: url = $page.url

</script>
<Card
    align_items="flex-start"
    gap="16px"
    padding="16px">
    <Paragraph>You must be logged in to access this section</Paragraph>
    <Button
        style="branded"
        href="/auth?redirect={encodeURIComponent(url.href)}"
        label="Start"
        right_icon={Settlement} />
</Card>