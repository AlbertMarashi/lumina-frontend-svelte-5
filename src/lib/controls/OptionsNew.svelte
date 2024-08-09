<script
    generics="T"
    lang="ts">
import type { Snippet } from "svelte"
import ScrollbarRegion from "./ScrollbarRegion.svelte"

let {
    onselect,
    selected,
    options,
    option,
    escape_up,
    escape_down,
    allow_other,
    search = $bindable("")
}: {
    onselect: (value: T) => void,
    selected?: T,
    options: T[],
    allow_other?: ((query: string) => T) | undefined,
    escape_up?: () => void,
    escape_down?: () => void,
    search?: string,
    option: Snippet<[T]>
} = $props()

let els: HTMLDivElement[] = $state([])

function handle_keypress(e: KeyboardEvent, index: number, other?: T) {
    if (e.key === "Enter") {
        onselect(other || options[index])
    }
    if (e.key === "ArrowUp") {
        if (index > 0) {
            els[index - 1].focus()
            els[index - 1].scrollIntoView()
        } else {
            escape_up?.()
        }
    }
    if (e.key === "ArrowDown") {
        if (index < els.length - 1) {
            els[index + 1].focus()
            els[index - 1].scrollIntoView()
        } else {
            escape_down?.()
        }
    }
}

export function focus() {
    els[0]?.focus()
}

</script>
<ScrollbarRegion>
    {#each options as item, i}
        <div
            bind:this={ els[i] }
            class="option"
            class:selected={ item === selected }
            onclick={e => {
                e.stopPropagation()
                onselect(item)
            }}
            onkeyup={e => handle_keypress(e, i)}
            role="button"
            tabindex="0">
            {@render option(item)}
        </div>
    {/each}
    {#if typeof allow_other === "function" && options.length === 0}
        <div
            class="other-option"
            onclick={_ => onselect(allow_other(search))}
            onkeyup={e => handle_keypress(e, els.length, allow_other && allow_other(search))}
            role="button"
            tabindex="0">
            Use "<strong>{ search }</strong>"
        </div>
    {:else if options.length === 0}
        <div class="hint">
            No options found
        </div>
    {/if}
</ScrollbarRegion>
<style>

.other-option {
    padding: 16px 16px;
    border-bottom: 1px solid rgba(var(--foreground-rgb), 0.06);
    cursor: pointer;
    font-size: 16px;
    color: rgba(var(--foreground-rgb), 0.5);
    &:last-child {
        border-bottom: none;
    }
    & strong {
        color: var(--foreground);
    }
    font-weight: 500;
    border-radius: 4px;
}

.hint {
    opacity: 0.3;
    font-size: 14px;
    padding: 16px;
}

.option {
    padding: 6px;
    width: 100%;
    border-bottom: 1px solid rgba(var(--foreground-rgb), 0.08);
    &.selected {
        background: rgba(var(--foreground-rgb), 0.08);
    }
    &:is(:hover, :focus) {
        background: rgba(var(--foreground-rgb), 0.04);
        outline: 0;
        cursor: pointer;
    }
    &:last-child {
        border-bottom: none;
    }
}

</style>