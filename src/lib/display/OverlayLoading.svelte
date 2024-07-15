
<script lang="ts">
import LogoLoading from "./LogoLoading.svelte"

let {
    position = "fixed",
    text
}: {
    position: "absolute" | "fixed",
    text?: string
} = $props()
</script>
<div
    style:position
    class="scrim">
    <LogoLoading/>
    {#if text}
        <h3>{ text }</h3>
    {/if}
</div>
<style>

.scrim {
    display: flex;
    flex-direction: column;
    justify-content: center;
    z-index: 1000;
    align-items: center;
    gap: 24px;
    background: rgba(0,0,0,0.7);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

@keyframes loading-message {
    from {
        color: white;
    }
    to {
        color: var(--brand);
    }
}
</style>