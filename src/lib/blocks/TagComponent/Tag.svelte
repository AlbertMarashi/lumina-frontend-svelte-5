<script lang="ts">
import Tag from "$lib/display/Tag.svelte"

let {
    text,
} : {
    text: string
} = $props()
</script>
<Tag text={text}/>