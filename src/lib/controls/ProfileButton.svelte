<script lang="ts">
import Profile from "$lib/display/Profile.svelte"

let {
    name = $bindable(),
    onclick = () => {}
} : {
    name?: string,
    onclick: (e: Event) => void
} = $props()

function clicked(e: Event) {
    e.stopPropagation()
    onclick(e)
}
</script>
<div
    class="profile-button-wrapper"
    class:has-name={ !!name }
    onclick={clicked}
    onkeydown={e => {
        if (e.key === "Enter" || e.key === "Escape") {
            clicked(e)
        }
    }}
    role="button"
    tabindex="0">
    <Profile --size="48px"/>
    {#if name}
        <div class="label">
            { name }
        </div>
    {/if}
</div>
<style>

.profile-button-wrapper {
    padding: 4px;
    cursor: pointer;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border-radius: 4px;
    width: 100%;
    height: 100%;
    &.has-name {
        justify-content: flex-start;
    }
    &:focus-visible {
        outline: 2px solid var(--brand);
        outline-offset: 2px;
    }
    &:is(:hover, :focus) {
        background: rgba(var(--foreground-rgb), 0.08);
    }
    &:active {
        background: rgba(var(--foreground-rgb), 0.12);
    }
    & .label {
        font-size: 16px;
        font-weight: 400;
        color: color-mix(var(--foreground), 80%);
        padding-right: 4px;
    }
}
</style>