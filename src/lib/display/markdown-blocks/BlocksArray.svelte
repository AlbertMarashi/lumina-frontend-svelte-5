<script lang="ts">
import GenericBlock from "./GenericBlock.svelte"
import type { RootContent } from "mdast"

export let blocks: RootContent[]
</script>

<div class="blocks-array">
    {#each blocks as block}
        <GenericBlock {block}/>
    {/each}
</div>

<style>
.blocks-array {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    line-height: 1.25;
    width: 100%;
    align-items: flex-start;
    text-align: inherit;
}
</style>