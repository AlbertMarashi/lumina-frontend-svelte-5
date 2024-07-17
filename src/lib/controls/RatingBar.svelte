<script lang="ts">
let {
    rating,
}: {
    rating: number;
} = $props()

let filledBars = $derived(Math.round(rating))
let emptyBars = $derived(5 - filledBars)
</script>

<div class="rating-bar">
    {#each Array(filledBars) as _}
        <div class="bar filled"></div>
    {/each}
    {#each Array(emptyBars) as _}
        <div class="bar empty"></div>
    {/each}
</div>

<style>
.rating-bar {
    display: flex;
    gap: 2px;
    border-radius: 50px;
    overflow: hidden;
    max-width: 200px;
    width: 100%
}

.bar {
    flex: 1;
    height: 10px;
}

.filled {
    background-color: var(--side-color, rgba(var(--foreground-rgb), 0.3));
}

.empty {
    background-color: rgba(var(--foreground-rgb), 0.1);
}
</style>
