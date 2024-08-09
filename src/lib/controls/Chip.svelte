<script lang="ts">
import Icon from "$lib/display/Icon.svelte"
import type { IconComponent } from "$lib/utils/icon_type"

let {
    href,
    target,
    label,
    disabled,
    left_icon,
    right_icon,
    small = false,
    style = "tonal",
    onclick
}: {
    href?: string,
    target?: string,
    label?: string,
    left_icon?: IconComponent,
    right_icon?: IconComponent,
    disabled?: boolean,
    small?: boolean,
    style?: "filled" | "tonal" | "outline",
    onclick?: (e: MouseEvent | KeyboardEvent) => void
} = $props()
</script>

<svelte:element
    this={ href ? "a" : "button" }
    class="chip"
    class:disabled
    class:filled={ style === "filled" }
    class:outline={ style === "outline" }
    class:small
    class:tonal={ style === "tonal" }
    aria-disabled={disabled}
    {disabled}
    href={href}
    onclick={onclick}
    role="button"
    tabindex={disabled ? -1 : 0}
    target={target}>
    {#if left_icon}
        <Icon icon={left_icon}/>
    {/if}
    <span>{ label }</span>
    {#if right_icon}
        <Icon icon={right_icon}/>
    {/if}
</svelte:element>
<style>

.chip {
    /* icon size */
    --size: 18px;

    display: flex;
    background: rgba(var(--foreground-rgb), 0.04);
    color: rgb(var(--foreground-rgb));
    border: 1px solid var(--foreground-rgb);
    border-radius: 8px;
    align-items: center;
    transition: background-color 0.1s, border-color 0.1s;
    padding: 0 8px;
    min-height: 32px;
    font-size: 16px;
    font-weight: 600;
    outline: none;
    &:not(.disabled) {
        cursor: pointer;
        &.filled {
            background: var(--brand);
            color: rgba(0, 0, 0, 0.75);

            &:hover, &:focus {
                background: color-mix(in srgb, var(--brand), var(--foreground) 12%);
            }

            &:active {
                background: color-mix(in srgb, var(--brand), var(--foreground) 16%);
            }
        }
        &.tonal {
            background: rgba(var(--brand-rgb), 0.20);
            color: var(--brand);
            color: color-mix(in srgb, var(--brand), var(--foreground) 70%);
            border-color: transparent;

            &:hover, &:focus {
                background: color-mix(in srgb, var(--brand), var(--foreground) 20%);
                color: white;
            }
            &:active {
                background: color-mix(in srgb, var(--brand), var(--foreground) 30%);
                color: white;
            }
        }
        &.outline {
            border-color: rgba(var(--foreground-rgb), 0.5);
            opacity: 0.8;
        }
    }

    &.disabled {
        opacity: 0.55;
        border: 1px solid rgba(var(--foreground-rgb), 0.5);
        --color: rgba(var(--foreground-rgb), 0.5);
        cursor: not-allowed;
    }
    & span {
        padding: 0 8px;
        font-size: 14px;
    }
    &.small {
        padding: 0 4px;
        min-height: 28px;
        --size: 16px;
        & span {
            padding: 0 6px;
            font-size: 14px;
        }
    }
}

</style>