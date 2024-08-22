<script lang="ts">
import Callout from "$lib/display/Callout.svelte"
import type { ContainerDirective } from "mdast-util-directive"
import BlocksArray from "./BlocksArray.svelte"

let {
    block,
}: {
    block: ContainerDirective,
} = $props()

</script>
<Callout type={block.type as "note"}>
    <BlocksArray blocks={block.children}/>
</Callout>