<script lang="ts">
import type { IconComponent } from "$lib/utils/icon_type"

let {
    href = null,
    left_icon = null,
    right_icon = null,
    style = "branded",
    hug = true,
    disabled,
    label,
    onclick = () => {},
} = $props<{
    href?: string | null
    left_icon?: IconComponent | string
    right_icon?: IconComponent | string
    style?: "translucent" | "transparent" | "branded"
    hug?: boolean
    disabled?: boolean
    label?: string
    onclick?: (e: Event) => void
}>()

let tag: "a" | "div" = $derived(href ? "a" : "div")

function clicked(e: Event) {
    if(disabled) e.preventDefault()
    else onclick(e)
}

function handle_keyup(e: KeyboardEvent) {
    if (e.key === "Enter") {
        clicked(e)
    }
}

</script>

<svelte:element
    this={ tag }
    class="button {style}"
    class:disabled
    class:hug
    href={href}
    onclick={clicked}
    onkeyup={handle_keyup}
    role="button"
    tabindex={disabled ? -1 : 0}
>
    {#if left_icon}
        <span class="icon">
            {#if typeof left_icon !== "string"}
                <svelte:component this={ left_icon } />
            {:else if typeof left_icon === "string"}
                <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                {@html left_icon}
            {/if}
        </span>
    {/if}
    {#if label}
        <span class="text">
            { label }
        </span>
    {/if}
    {#if right_icon}
        <span class="icon">
            {#if typeof right_icon !== "string"}
                <svelte:component this={ right_icon } />
            {:else if typeof right_icon === "string"}
                <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                {@html right_icon}
            {/if}
        </span>
    {/if}
</svelte:element>

<style>
.button {
    padding: 9px 10px;
    color: var(--foreground);
    display: inline-flex;
    align-items: center;
    white-space: nowrap;
    justify-content: center;
    border-radius: 4px;
    width: 100%;
    cursor: pointer;
    font-weight: 600;

    & .text {
        padding: 2px 11px;
    }

    &.hug {
        width: auto;
    }

    & .icon {
        font-size: 20px;
        display: inline-flex;
    }

    &:not(.disabled) {
        outline: none;

        &.branded {
            background: var(--brand);
            color: white;

            &:is(:hover, :focus) {
                background: color-mix(in srgb, var(--brand), var(--foreground) 14%);
            }

            &:active {
                background: var(--brand);
            }
        }

        &.translucent {
            background: rgba(var(--foreground-rgb), 0.08);

            &:hover, &:focus {
                background: color-mix(in srgb, var(--foreground) 14%, transparent);
            }

            &:active {
                background: rgba(var(--foreground-rgb), 0.08);
            }
        }

        &.transparent {
            color: color-mix(in srgb, var(--foreground) 60%, transparent);
            background: color-mix(in srgb, var(--foreground) 0%, transparent);

            &:hover, &:focus {
                background: color-mix(in srgb, var(--foreground) 12%, transparent);
                color: var(--foreground);
            }

            &:active {
                background: rgba(var(--foreground-rgb), 0.06);
            }
        }
    }

    &.disabled {
        cursor: default;
        background: transparent;
        outline: 1px solid rgba(var(--foreground-rgb), 0.1);
        outline-offset: 1px;
        color: color-mix(in srgb, var(--foreground) 30%, transparent);
    }
}
</style>