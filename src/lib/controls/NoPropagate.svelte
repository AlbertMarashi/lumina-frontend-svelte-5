<script lang="ts">
import type { Snippet } from "svelte"

let {
    children
}: {
    children: Snippet
} = $props()
</script>
<div
    style:display="contents"
    onclick={e => e.stopPropagation()}
    role="presentation">
    {@render children()}
</div>