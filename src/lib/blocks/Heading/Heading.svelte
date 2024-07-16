<script lang="ts">
import { icons } from "$lib/data/icons.svelte"
import Heading from "$lib/display/Heading.svelte"
import load_icon_dynamic from "$lib/icons/load_icon_dynamic"

let {
    text,
    left_icon,
    right_icon,
    level = 1,
    underline = false,
} : {
    level: 1 | 2 | 3 | 4 | 5 | 6,
    underline: boolean,
    text: string
    left_icon: string | undefined
    right_icon: string | undefined
} = $props()

let left_icon_svg = $derived( left_icon ? icons[left_icon] : undefined)
let right_icon_svg = $derived( right_icon ? icons[right_icon] : undefined)

$effect( () => {
    if (!left_icon_svg && left_icon) load_icon(left_icon)
    if (!right_icon_svg && right_icon) load_icon(right_icon)
})

async function load_icon(name: string) {
    icons[name] = await load_icon_dynamic(name)
}
</script>
<Heading
    left_icon={left_icon_svg}
    level={level}
    right_icon={right_icon_svg}
    text={text}
    underline={underline}/>