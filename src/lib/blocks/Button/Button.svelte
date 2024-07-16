<script lang="ts">
import Button from "$lib/controls/Button.svelte"
import { icons } from "$lib/data/icons.svelte"
import load_icon_dynamic from "$lib/icons/load_icon_dynamic"

let {
    style,
    text,
    left_icon,
    right_icon,
    hug = true,
} : {
    style: "branded" | "translucent" | "transparent"
    text: string,
    left_icon: string | undefined,
    right_icon: string | undefined
    hug: boolean
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
<Button
    style={style}
    hug={hug}
    label={text}
    left_icon={left_icon_svg}
    right_icon={right_icon_svg}/>