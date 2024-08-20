<script lang="ts">
import type { IconComponent } from "$lib/utils/icon_type"

export let href: string | undefined = undefined
export let left_icon: IconComponent | undefined = undefined
export let right_icon: IconComponent | undefined = undefined
export let right_icon_opacity = 0.5
export let left_icon_opacity = 0.5
export let text_opacity = 1
export let tabindex: number | undefined = undefined
export let style: "translucent" | "branded" | "outline" = "translucent"
export let disabled = false
export let text: string | undefined = undefined
export let onclick: undefined | ((e: MouseEvent | KeyboardEvent) => void) = undefined

function click(e: MouseEvent | KeyboardEvent) {
    if (!disabled) {
        onclick?.(e)
    }
}

function handle_keyup(e: KeyboardEvent) {
    if (e.key === "Enter") {
        click(e)
    }
}

$: tag = href ? "a" : "div" as "a" | "div"
</script>

<svelte:element
    this={ tag }
    class="segment {style}"
    class:disabled={ disabled }
    href={href}
    role="button"
    tabindex={tabindex ?? disabled ? -1 : 0}
    on:click={ click }
    on:keyup={ handle_keyup }
>
    {#if left_icon}
        <span
            style:opacity={ left_icon_opacity }
            class="icon">
            <svelte:component this={ left_icon } />
        </span>
    {/if}
    {#if text || $$slots.default}
        <div
            style:opacity={ text_opacity }
            class="text">
            {#if text}
                { text }
            {:else}
                <slot/>
            {/if}
        </div>
    {/if}
    {#if right_icon}
        <span
            style:opacity={ right_icon_opacity }
            class="icon">
            <svelte:component this={ right_icon } />
        </span>
    {/if}
</svelte:element>

<style>
.segment {
    padding: 8px;
    background: rgba(var(--foreground-rgb), 0.06);
    color: rgba(var(--foreground-rgb), 0.9);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50px;
    cursor: pointer;
    font-weight: 550;
    font-size: 15px;
    &:hover {
        background: rgba(var(--foreground-rgb), 0.1);
    }

    &:focus-visible {
        outline: 2px solid var(--brand);
        outline-offset: 2px;
    }

    &.branded {
        background: var(--brand);
        background: color-mix(in srgb, var(--brand), var(--background) 12%);
        color: white;
        &:hover {
            background: color-mix(in srgb, var(--brand), var(--foreground) 12%);
        }
    }

    &.outline {
        background: transparent;
        outline: 1px solid rgba(var(--foreground-rgb), 0.1);
        outline-offset: -1px;
        &:hover {
            background: rgba(var(--foreground-rgb), 0.05);
        }
        &:focus-visible {
            outline: 2px solid var(--brand);
            outline-offset: 2px;
        }
    }

    &.disabled {
        cursor: default;
        opacity: 0.5;
        background: transparent;
        border: 1px solid rgba(var(--foreground-rgb), 0.1);
        color: rgba(var(--foreground-rgb), 0.5);
        &:hover {
            background: transparent;
            outline: none;
        }
    }
    & .text {
        padding: 1px 6px;
        line-height: 100%;
    }
    & .icon {
        font-size: 18px;
        display: inline-flex;
    }
}
</style>
