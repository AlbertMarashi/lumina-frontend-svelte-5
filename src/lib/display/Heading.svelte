<script lang="ts">

import type { IconComponent } from "$lib/utils/icon_type"

import Icon from "./Icon.svelte"

export let left_icon: IconComponent | string | null = null
export let left_icon_color = "var(--brand)"
export let right_icon: IconComponent | string | null = null
export let right_icon_color = "var(--brand)"
export let underline_color: string | null = null
export let level: 1 | 2 | 3 | 4 | 5 | 6 = 1
export let id: string | null = null
export let underline = false
export let center = false
export let text: string
</script>

<svelte:element
    this={ "h" + level }
    {id}
    style:--underline-color={ underline_color }
    class="heading"
    class:center
    class:underline>
    {#if left_icon && typeof left_icon !== "string"}
        <Icon
            --color={left_icon_color}
            icon={left_icon}/>
    {:else if left_icon && typeof left_icon === "string"}
        <icon style:--color={ left_icon_color }>
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html left_icon}
        </icon>
    {/if}
    <span>
        { text }
    </span>
    {#if right_icon && typeof right_icon !== "string"}
        <Icon
            --color={right_icon_color}
            icon={right_icon}/>
    {:else if right_icon && typeof right_icon === "string"}
        <icon style:--color={ right_icon_color }>
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html right_icon}
        </icon>
    {/if}
</svelte:element>
<style>

icon {
    color: var(--color);
    display: inline-flex;
}

.heading {
    font-weight: 700;
    display: inline-flex;
    flex-wrap: wrap;
    gap: 0.4em;
    align-items: center;
    margin: 0;
    position: relative;
    scroll-margin-top: 80px;
    z-index: 1;
    &.center {
        display: flex;
        justify-content: center;
    }
    &.underline {
        padding: 0 4px;
        padding-bottom: 0.05em;
        &::before {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            top: 60%;
            background: var(--underline-color, var(--brand));
            opacity: 0.4;
            z-index: -1;
        }
    }
}

h1 {
    font-size: 32px;
    font-weight: 800;
}

h2 {
    font-size: 26px;
    font-weight: 800;
}

h3 {
    font-size: 20px;
    font-weight: 800;
}

h4 {
    font-size: 16px;
    font-weight: 800;
}
</style>