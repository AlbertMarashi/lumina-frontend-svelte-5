<script lang="ts">
import { createEventDispatcher } from "svelte"

let dispatch = createEventDispatcher()

export let href: string | undefined = undefined
export let padding = "0px"
export let max_width: string | undefined = undefined
export let shadow = true
export let direction: "vertical" | "horizontal" = "vertical"
export let gap: number | string = 0
export let reset_bg = false
export let opacity = false
export let interactive = false
export let align_items: "center" | "flex-start" | "flex-end" | "stretch" | "normal" = "center"
export let justify_content: "center" | "flex-start" | "flex-end" | "space-between" | "space-around" | "space-evenly" | "normal" = "normal"
export let disabled = false

$: is_clickable = (href || interactive)

$: tag = href ? "a" : "div" as "a" | "div"

function clicked(e: Event) {
    if(is_clickable) dispatch("click", e)
}

function handle_keyup(e: KeyboardEvent) {
    if (e.key === "Enter") {
        clicked(e)
    }
}
</script>
<svelte:element
    this={ tag }
    style:max-width={ max_width }
    style:gap={ typeof gap === "number" ? gap + "px" : gap }
    style:align-items={ align_items }
    style:justify-content={ justify_content }
    style:padding={ padding }
    class="card"
    class:clickable={ is_clickable }
    class:disabled={ disabled }
    class:horizontal={ direction === "horizontal" }
    class:opacity={ opacity }
    class:reset_bg={ reset_bg }
    class:shadow={ shadow }
    class:vertical={ direction === "vertical" }
    {href}
    role={is_clickable ? "button" : undefined}
    tabindex={is_clickable ? 0 : -1}
    on:click={ clicked }
    on:keyup={ handle_keyup }>
    <slot/>
</svelte:element>
<style>
.card {
    border-radius: 6px;
    color: var(--foreground);
    background: color-mix(in srgb, var(--foreground) 4%, var(--background));
    width: 100%;
    display: flex;
    outline: none;
    &.disabled {
        opacity: 0.5;
        pointer-events: none;
    }

    &.clickable {
        cursor: pointer;

        &:hover {
            background: color-mix(in srgb, var(--foreground) 8%, var(--background));
        }

        &:focus-visible, &:focus {
            outline: 2px solid var(--brand);
            outline-offset: 2px;
        }
    }

    &.shadow {
        box-shadow: 0 2px 8px -4px rgba(0, 0, 0, 0.5);
        /* border: 1px solid rgba(var(--foreground-rgb), 0.05); */
    }

    &.reset_bg {
        background: color-mix(in srgb, var(--foreground) 6%, var(--background));

    }

    &.vertical {
        flex-direction: column;
    }

    &.horizontal {
        flex-direction: row;
    }

    &.opacity {
        opacity: 0.5;
    }

}
</style>