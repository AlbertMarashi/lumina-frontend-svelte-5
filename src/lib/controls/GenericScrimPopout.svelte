<script lang="ts">
import type { Snippet } from "svelte"

let {
    element,
    dropdown,
    max_width = $bindable(600),
}: {
    element: Snippet<[{
        opened: boolean,
        set: (value: boolean) => void,
        toggle: () => void,
    }]>,
    dropdown: Snippet<[{ close: () => void }]>,
    max_width?: number,
} = $props()

let opened = $state(false)
let scrim = $state(undefined! as HTMLElement)
</script>
{@render element({
    opened,
    set: (value: boolean) => opened = value,
    toggle: () => opened = !opened,
})}
{#if opened}
    <scrim
        bind:this={ scrim }
        onclick={(e: { target: HTMLElement; }) => {
            if (e.target === scrim) opened = false
        }}
        role="presentation">
        <dialog-popup style:max-width={ max_width + "px" }>
            {@render dropdown({
                close: () => opened = false,
            })}
        </dialog-popup>
    </scrim>
{/if}
<style>
scrim {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(var(--background-rgb), 0.8);
    background: color-mix(in srgb, var(--background) 50%, color-mix(in srgb, var(--foreground) 20%, transparent));
    backdrop-filter: blur(8px);
    z-index: 19;
}

dialog-popup {
    background: color-mix(in srgb, var(--background) 90%, var(--foreground));
    box-shadow: 0px 10px 16px -6px rgba(0,0,0,0.5);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    max-height: 800px;
    width: 100%;
    z-index: 20;
    border-radius: 16px;
}
</style>