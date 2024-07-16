<script lang="ts">
import type { Snippet } from "svelte"
let {
    close = () => {},
    children
}: {
    close: () => void,
    children: Snippet
} = $props()

let scrim: HTMLDivElement = $state()!

</script>
<div
    bind:this={ scrim }
    class="scrim"
    onclick={e => {
        if (e.target === scrim) {
            close()
        }
    }}
    role="presentation">
    {@render children()}
</div>
<style>
.scrim {
    z-index: 99;
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    padding: 40px;
    right: 0;
    bottom: 0;
    background: color-mix(in srgb, black 40%, transparent);
    backdrop-filter: blur(4px);
}
</style>