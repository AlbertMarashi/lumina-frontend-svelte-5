
<script lang="ts">
import PlaceholderIcon from "$lib/icons/PlaceholderIcon.svelte"
import load_icon_dynamic from "$lib/icons/load_icon_dynamic"
import { icons } from "$lib/data/icons.svelte"

export let name: string

function load_icon(name: string) {
    if (icons && name in icons) {
        return icons[name]
    }
    return load_icon_dynamic(name)
}

$: icon_svg = load_icon(name)
</script>
{#await icon_svg}
    <PlaceholderIcon/>
{:then svg}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html svg}
{/await}