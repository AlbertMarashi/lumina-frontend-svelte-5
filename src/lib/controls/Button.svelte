<script lang="ts">
import type { IconComponent } from "$lib/utils/icon_type"

let {
    href,
    left_icon,
    right_icon,
    style = "branded",
    hug = true,
    disabled,
    label,
    target,
    onclick,
}: {
    href?: string
    left_icon?: IconComponent | string
    right_icon?: IconComponent | string
    style?: "translucent" | "transparent" | "branded"
    hug?: boolean
    target?: "_blank"
    disabled?: boolean
    label?: string
    onclick?: (e: Event) => void
} = $props()

let tag: "a" | "div" = $derived(href ? "a" : "div")

function clicked(e: Event) {
    if(disabled) e.preventDefault()
    else onclick?.(e)
}

function handle_keyup(e: KeyboardEvent) {
    if (e.key === "Enter") {
        clicked(e)
    }
}

let LeftIcon = $derived(typeof left_icon === "string" ? null : left_icon)
let RightIcon = $derived(typeof right_icon === "string" ? null : right_icon)

</script>

<svelte:element
    this={ tag }
    class="button {style}"
    class:disabled={ disabled }
    class:hug={ hug }
    href={href}
    onclick={onclick ? clicked : null}
    onkeyup={handle_keyup}
    role="button"
    tabindex={disabled ? -1 : 0}
    target={target}
>
    {#if left_icon}
        <span class="icon">
            {#if typeof left_icon !== "string"}
                <LeftIcon />
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
                <RightIcon />
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