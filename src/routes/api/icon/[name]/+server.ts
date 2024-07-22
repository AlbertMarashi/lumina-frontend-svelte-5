import type { IconComponent } from "$lib/utils/icon_type.js"
import { render } from "svelte/server"

const icons = import.meta.glob("$lib/icons/*.svelte")

export async function GET({ params }) {
    // check if the icon exists in local set
    const icon = icons[`/src/lib/icons/${params.name}.svelte`] as (() => Promise<{ default: IconComponent }>) | undefined
    if(icon) {
        const { default: component }= await icon()
        return new Response(render(component).body)
    }
    return new Response(await(await fetch("https://icons.siteforge.io/api/icon/" + params.name)).text())
}