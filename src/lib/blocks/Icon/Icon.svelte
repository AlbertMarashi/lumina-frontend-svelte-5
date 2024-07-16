<script lang="ts">
import { icons } from "$lib/data/icons.svelte"
import load_icon_dynamic from "$lib/icons/load_icon_dynamic"

let {
    name,
} : {
    name: string
} = $props()

let icon_svg = $derived(icons[name])

$effect( () => {
    if (!icon_svg && name) load_icon(name)
})

async function load_icon(name: string) {
    icons[name] = await load_icon_dynamic(name)
}
</script>
{#if icon_svg}
    <icon>
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html icon_svg}
    </icon>
{/if}