<script lang="ts">
import {getNearestFixedPositioningContainer, getElementOffset, getNearestScrollableParent } from "$lib/utils/element_utils"
import { type Snippet } from "svelte"

type Position = "bottom-left" | "bottom-center" | "bottom-right" | "left-top" | "left-center" | "left-bottom" | "right-top" | "right-center" | "right-bottom" | "top-left" | "top-center" | "top-right";

let {
    element,
    dropdown,
    position = $bindable<Position>("bottom-left"),
    margin = $bindable(8),
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
    position?: Position,
    margin?: number,
    width?: number,
    side_offset?: number,
    padding?: number,
} = $props()

// const noop = (...args: unknown[]) => undefined

let opened = $state(false)
let anchor_el = $state(undefined! as HTMLElement)
let dropdown_el = $state(undefined! as HTMLDivElement)
let window_height = $state(0)
let window_width = $state(0)
let el = $derived(anchor_el?.firstElementChild as HTMLElement)
let scrollY = $state(0)
let scrollX = $state(0)

let {
    top, left
} = $derived.by(() => {
    if (!anchor_el || !dropdown_el || !el && !opened) return { top: 0, left: 0 }

    let offset = getElementOffset(el)

    const rect = {
        top: offset.top,
        left: offset.left,
        width: el.offsetWidth,
        height: el.offsetHeight,
        bottom: offset.top + el.offsetHeight,
        right: offset.left + el.offsetWidth
    }

    // const rect = el.getBoundingClientRect()
    // const rect = {
    //     top: el.offsetLeft,
    //     left: el.offsetTop,
    //     width: el.offsetWidth,
    //     height: el.offsetHeight,
    //     bottom: el.offsetTop + el.offsetHeight,
    //     right: el.offsetLeft + el.offsetWidth
    // }

    const dropdown_rect = {
        width: dropdown_el.offsetWidth,
        height: dropdown_el.offsetHeight
    }

    // top, left
    const positions = {
        "bottom-left": [rect.bottom + margin, rect.left],
        "bottom-center": [rect.bottom + margin, rect.left + rect.width / 2 - dropdown_rect.width / 2],
        "bottom-right": [rect.bottom + margin, rect.right - dropdown_rect.width],
        "left-top": [rect.top, rect.left - dropdown_rect.width - margin],
        "left-center": [rect.top + rect.height / 2 - dropdown_rect.height / 2, rect.left - dropdown_rect.width - margin],
        "left-bottom": [rect.bottom - dropdown_rect.height, rect.left - dropdown_rect.width - margin],
        "right-top": [rect.top, rect.right + margin],
        "right-center": [rect.top + rect.height / 2 - dropdown_rect.height / 2, rect.right + margin],
        "right-bottom": [rect.bottom - dropdown_rect.height, rect.right + margin],
        "top-left": [rect.top - dropdown_rect.height - margin, rect.left],
        "top-center": [rect.top - dropdown_rect.height - margin, rect.left + rect.width / 2 - dropdown_rect.width / 2],
        "top-right": [rect.top - dropdown_rect.height - margin, rect.right - dropdown_rect.width]
    }

    let [top, left] = positions[position]

    let max_top = window_height - dropdown_rect.height - side_offset
    let max_left = window_width - dropdown_rect.width - side_offset

    const fixedContainer = getNearestFixedPositioningContainer(anchor_el)

    if (fixedContainer) {
        let offset = getElementOffset(fixedContainer)

        top -= scrollY
        left -= scrollX

        top = Math.max(side_offset, Math.min(top, max_top))
        left = Math.max(side_offset, Math.min(left, max_left))

        top += scrollY
        left += scrollX
        top -= offset.top
        left -= offset.left
    } else {
        top -= scrollY
        left -= scrollX
        top = Math.max(side_offset, Math.min(top, max_top))
        left = Math.max(side_offset, Math.min(left, max_left))
    }


    return {
        top,
        left
    }
})

$effect(() => {
    if (window_height || window_width) {}

    let v_scroller = getNearestScrollableParent(anchor_el, "vertical")
    let h_scroller = getNearestScrollableParent(anchor_el, "horizontal")

    scrollY = v_scroller?.scrollTop || 0
    scrollX = h_scroller?.scrollLeft || 0

    function update_scroll () {
        scrollY = v_scroller?.scrollTop || 0
        scrollX = h_scroller?.scrollLeft || 0
    }

    if (v_scroller) v_scroller.addEventListener("scroll", update_scroll)
    if (h_scroller) h_scroller.addEventListener("scroll", update_scroll)

    return () => {
        if (v_scroller) v_scroller.removeEventListener("scroll", update_scroll)
        if (h_scroller) h_scroller.removeEventListener("scroll", update_scroll)
    }
})

function close_if_outside(e: MouseEvent) {
    if (!dropdown_el || !el) return
    if (
        !dropdown_el.contains(e.target as HTMLElement) &&
        !el.contains(e.target as HTMLElement)
    ) opened = false
}

</script>

<svelte:window
    onclickcapture={e => close_if_outside(e)}
    bind:innerHeight={ window_height }
    bind:innerWidth={ window_width }
/>

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
        style:max-width={ `${width}px` }
        style:left={ `${left}px` }
        style:top={ `${top}px` }
        style:padding={ `${padding}px` }>
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
    background: color-mix(in srgb, var(--background) 97%, var(--foreground));
    /* background: red; */
    border: 1px solid rgba(var(--foreground-rgb), 0.1);
    box-shadow: 0px 10px 16px -6px rgba(0,0,0,0.3);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    width: 100%;
    z-index: 20;
    border-radius: 6px;
}
</style>