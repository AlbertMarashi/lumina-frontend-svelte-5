<script lang="ts">
import Icon from "$lib/display/Icon.svelte"
import type { IconComponent } from "$lib/utils/icon_type"

let {
    href,
    icon,
    opacity = true,
    onclick = () => {}
}: {
    href?: string
    icon: IconComponent
    opacity?: boolean,
    onclick?: (e: Event) => void
} = $props()

let tag: "a" | "div" = $derived(href ? "a" : "div")

function handle_keyup(e: KeyboardEvent) {
    if (e.key === "Enter") {
        onclick(e)
    }
}

// let Icon = $derived(icon)
</script>

<svelte:element
    this={ tag }
    class="button"
    class:opacity={ opacity }
    href={href}
    onclick={onclick}
    onkeyup={handle_keyup}
    role="button"
    tabindex="0">
    <Icon icon={icon}/>
</svelte:element>
<style>
.button {
    padding: 8px;
    background: none;
    color: var(--foreground);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    font-size: 24px;
    &.opacity {
        color: color-mix(in srgb, var(--foreground) 60%, transparent);
    }

    &:hover {
        background: color-mix(in srgb, var(--foreground) 12%, transparent);
        color: var(--foreground);
    }

    &:active {
        background: rgba(var(--foreground-rgb), 0.08);
        color: var(--foreground);
    }

    &:focus-visible {
        outline: none;
    }
}

</style>