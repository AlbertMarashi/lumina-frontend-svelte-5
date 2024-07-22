<script lang="ts">
import type { Snippet } from "svelte"


let {
    align = "start",
    justify = "start",
    children,
}: {
    align?: "start" | "center" | "end",
    justify?: "start" | "center" | "end",
    children: Snippet
} = $props()

</script>
<div
    style:align-items={ align }
    style:justify-content={ justify }
    class="flex-wrap">
    {@render children()}
</div>
<style>

.flex-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}
</style>