<script lang="ts">
let {
    vote_data = $bindable(),
    show_rating_ui = $bindable(false),
    my_rating = $bindable(),
}: {
    my_rating?: {
        rating: number,
    }
    vote_data?: {
        rating_avg: number,
        total_votes: number,
    }
    show_rating_ui: boolean
} = $props()

let show_rating = $derived(vote_data && vote_data.total_votes > 5)
// let show_rating = $derived(true)
let width = $derived(((vote_data?.rating_avg || 0) / 4) * 100)

</script>

<div class="wrapper">
    <div
        class="rating-bar"
        onclick={() => show_rating_ui = !show_rating_ui}
        onkeydown={e => {
            if (e.key === "Enter") show_rating_ui = !show_rating_ui }}
        role="button"
        tabindex="0">
        <inner-bar>
            <bar
                style:width={ show_rating ? `${width}%` : "100%" }
                class:indeterminate={ !show_rating }></bar>
        </inner-bar>
    </div>
    {#if !show_rating || !my_rating}
        <tag
            class="purple"
            onclick={() => show_rating_ui = !show_rating_ui}
            onkeydown={e => {
                if (e.key === "Enter") show_rating_ui = !show_rating_ui }}
            role="button"
            tabindex="0">
            { my_rating ? "New" : "Rate Me" }
        </tag>
    {:else if my_rating}
        <tag>
            Rated
        </tag>
    {/if}
</div>
<style>

bar {
    background: var(--side-color, rgba(var(--foreground-rgb), 0.5));
    /* transition: width 0.2s ease-in-out; */
    height: 12px;
    &.indeterminate {
        background: linear-gradient(to right, rgba(var(--foreground-rgb), 0) 20%, rgba(var(--foreground-rgb), 0.3) 50%, rgba(var(--foreground-rgb), 0) 80%);
    }
}
.wrapper {
    display: flex;
    gap: 10px;
    flex: 1;
    align-items: center;
    tag {
        font-size: 14px;
        color: rgba(var(--foreground-rgb), 0.5);
        font-style: italic;
        padding: 3px 6px;
        background: rgba(var(--foreground-rgb), 0.1);
        border: 1px solid rgba(var(--foreground-rgb), 0.1);
        border-radius: 8px;
        outline: none;
        &.purple {
            cursor: pointer;
            background: rgba(var(--brand-rgb), 0.1);
            color: rgba(var(--brand-rgb), 1);
            border-color: rgba(var(--brand-rgb), 0.2);
            &:hover, &:focus {
                background: rgba(var(--brand-rgb), 0.2);
            }
        }
    }
}
.rating-bar {
    display: flex;
    gap: 2px;
    border-radius: 50px;
    overflow: hidden;
    max-width: 200px;
    width: 100%;
    cursor: pointer;
    padding: 4px;
    margin: -4px;
    &:hover, &:focus {
        outline: 2px solid rgba(var(--foreground-rgb), 0.2);
        /* outline-offset: 4px; */
    }
    inner-bar {
        display: flex;
        gap: 2px;
        border-radius: 50px;
        background: rgba(var(--foreground-rgb), 0.1);
        overflow: hidden;
        width: 100%;
    }
}
</style>
