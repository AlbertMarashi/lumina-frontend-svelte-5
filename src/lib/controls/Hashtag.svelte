<script lang="ts">
import { page } from "$app/stores"
import { SvelteSet } from "svelte/reactivity"

let {
    text,
    active = false,
    count,
    onclick,
}: {
    text: string,
    active?: boolean,
    count?: number,
    onclick?: () => void,
} = $props()

let current_tags = $derived(new SvelteSet($page.url.searchParams.get("tag")?.split(",")))
$inspect(current_tags)
let in_current = $derived(current_tags.has(text))
let without_self = $derived(new SvelteSet([...current_tags].filter(tag => tag !== text)))
let with_self = $derived(new SvelteSet([...current_tags, text]))
let nav_url_tags = $derived(in_current ? [...without_self] : [...with_self])
let tags_query = $derived(nav_url_tags.length ? `?tag=${nav_url_tags.join(",")}` : "")
</script>
<svelte:element
    this={ onclick ? "span" : "a" }
    class="hashtag"
    class:active
    href={onclick ? undefined : `/town-hall/${tags_query}`}
    onclick={onclick}
    role={onclick ? "button" : undefined}>
    <span>#{ text }</span>
    {#if count}
        <bubble>{ count }</bubble>
    {/if}
</svelte:element>
<style>
.hashtag {
    display: inline-flex;
    align-items: center;
    padding: 8px;
    outline: 1px solid rgba(var(--foreground-rgb), 0.1);
    color: rgba(var(--foreground-rgb), 0.7);
    outline-offset: -1px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    gap: 6px;
    &.active {
        background: rgba(var(--brand-rgb), 0.14);
        color: rgba(var(--foreground-rgb), 0.8);
        outline: none;
        &:hover, &:focus {
            background: rgba(var(--brand-rgb), 0.2);
        }
    }
    &:hover {
        background: rgba(var(--foreground-rgb), 0.05);
    }
    bubble {
        display: flex;
        padding: 2px 6px;
        background: rgba(var(--foreground-rgb), 0.1);
        border-radius: 100px;
    }
    span {
        padding: 2px 0;
    }
}
</style>