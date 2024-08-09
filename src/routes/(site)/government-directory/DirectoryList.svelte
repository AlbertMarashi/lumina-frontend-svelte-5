<script lang="ts">
import DirectoryItem from "./DirectoryItem.svelte"
import type { Organisation } from "./org_types"

export let organisations: Array<Organisation>

</script>
<div class="directory-list">
    {#each organisations as organisation}
        <DirectoryItem {organisation} />
    {/each}
</div>
<style>
.directory-list {
    display: flex;
    flex-direction: column;
    background: color-mix(in srgb, var(--background), var(--foreground) 4%);
    border-radius: 8px;
    width: 100%;
    min-height: 800px;
}
</style>