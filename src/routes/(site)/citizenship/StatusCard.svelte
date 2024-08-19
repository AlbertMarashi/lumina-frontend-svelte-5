<script lang="ts">
import type { IconComponent } from "$lib/utils/icon_type"
import type { Snippet } from "svelte"

let {
    title,
    left_icon,
    children
}: {
    title: string,
    left_icon: IconComponent,
    children: Snippet
} = $props()

let LeftIcon = $derived(left_icon)
</script>
<div class="status">
    <div class="title">
        { title }
    </div>
    <div class="data">
        <div class="icon">
            <LeftIcon/>
        </div>
        {@render children()}
    </div>
</div>

<style>
.status {
    padding: 16px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    font-size: 22px;
    font-weight: 600;
    background: rgba(var(--foreground-rgb), 0.04);
    gap: 8px;
    & .title {
        font-size: 14px;
        font-weight: 700;
        opacity: 0.5;
        text-transform: uppercase;
    }
    & .data {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    & .icon {
        display: inline-flex;
        color: var(--yellow)
    }
}
</style>