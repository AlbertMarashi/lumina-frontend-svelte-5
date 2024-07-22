<script lang="ts">
import type { Snippet } from "svelte"

let {
    element,
    dropdown,
    margin_top = $bindable(8),
    width = $bindable(350),
    side_offset = $bindable(16),
    padding = $bindable(0),
}: {
    element: Snippet<[{
        opened: boolean,
        set: (value: boolean) => void,
        toggle: () => void,
    }]>,
    dropdown: Snippet<[{ close: () => void }]>,
    margin_top?: number,
    width?: number,
    side_offset?: number,
    padding?: number,
} = $props()

let opened = $state(false)
let anchor_el = $state(undefined! as HTMLElement)
let el = $derived(anchor_el?.firstElementChild)
let dropdown_el = $state(undefined! as HTMLDivElement)
let window_height = $state(0)
let window_width = $state(0)
let rect = $derived((window_height && window_width && el) ? el.getBoundingClientRect() : undefined)
let top = $derived((rect?.bottom || 0) + margin_top)
let max_width = $derived(Math.min(window_width - side_offset * 2, width))
let max_left = $derived(window_width - max_width - side_offset)
let left = $derived(Math.min(max_left, ((rect?.left || 0) + (rect?.right || 0)) / 2 - max_width / 2))

function close_if_outside(e: MouseEvent) {
    if (
        dropdown_el && !dropdown_el.contains(e.target as HTMLElement)
        && el && !el.contains(e.target as HTMLElement)
    ) opened = false
}


</script>
<svelte:window
    onclick={e => close_if_outside(e)}
    bind:innerHeight={ window_height }
    bind:innerWidth={ window_width }/>
<anchor-element bind:this={ anchor_el }>
    {@render element({
        opened,
        set: (value: boolean) => opened = value,
        toggle: () => opened = !opened,
    })}
</anchor-element>
{#if opened}
    <dropdown
        bind:this={ dropdown_el }
        style:max-width={ max_width + "px" }
        style:margin-top={ margin_top + "px" }
        style:left={ left + "px" }
        style:padding={ padding + "px" }
        style:top={ top + "px" }>
        {@render dropdown({
            close: () => opened = false,
        })}
    </dropdown>
{/if}
<style>
anchor-element {
    display: contents;
}

dropdown {
    position: fixed;
    background: color-mix(in srgb, var(--background) 90%, var(--foreground));
    box-shadow: 0px 10px 16px -6px rgba(0,0,0,0.5);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    width: 100%;
    z-index: 20;
    border-radius: 6px;
}
</style>