<script lang="ts">
import stop_propagation from "$lib/utils/stop_propagation"

let {
    vote_data = $bindable(),
    show_rating_ui = $bindable(false),
}: {
    vote_data?: {
        rating_avg: number,
        total_votes: number,
    }
    show_rating_ui: boolean
} = $props()

let show_rating = $derived(vote_data && vote_data.total_votes > 1)
let width = $derived(((vote_data?.rating_avg || 0) / 4) * 100)
</script>

<div class="wrapper">
    <div
        class="rating-bar"
        onclick={stop_propagation(() => show_rating_ui = !show_rating_ui)}
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
