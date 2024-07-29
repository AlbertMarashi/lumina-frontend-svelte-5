<script lang="ts">
import { get_plain_text } from "$lib/utils/plain_text"
import type { Heading } from "mdast"
import PhrasingContent from "./PhrasingContentArray.svelte"

export let block: Heading

$: plain_text = get_plain_text(block.children)
$: id = plain_text.toLowerCase().replace(/ /g, "-")

</script>
<svelte:element
    this={ "h" + block.depth }
    {id}>
    <PhrasingContent children={block.children}/>
</svelte:element>
<style>
h1 {
    font-size: 2.5em;
}
h2 {
    font-size: 2em;
}
h3 {
    font-size: 1.5em;
}
h4 {
    font-size: 1.25em;
}
h5 {
    font-size: 1.125em;
}
h6 {
    font-size: 1em;
}
</style>