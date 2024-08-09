import load_icon_dynamic from "$lib/icons/load_icon_dynamic"
import type { BuilderBlock } from "@builder.io/sdk-svelte"

export async function load_icons(icon_names: string[], f: typeof fetch): Promise<Record<string, string>> {
    return Object.fromEntries(
        await Promise.all(icon_names.map(async name => [name, await load_icon_dynamic(name, f)]))
    )
}

export function find_icon_names(blocks: BuilderBlock[], icon_names: Set<string>) {
    for (const block of blocks) {
        if ("children" in block) {
            find_icon_names(block.children || [], icon_names)
        }
        if ("component" in block) {
            if (block.component?.name === "Columns") {
                for (const column of block.component.options?.columns || []) {
                    find_icon_names(column.blocks || [], icon_names)
                }
            } else if (block.component?.name === "Button") {
                if (block.component.options?.left_icon) icon_names.add(block.component.options.left_icon)
                if (block.component.options?.right_icon) icon_names.add(block.component.options.right_icon)
            } else if (block.component?.name === "Icon") {
                icon_names.add(block.component.options.name)
            } else if (block.component?.name === "Heading") {
                if (block.component.options?.left_icon) icon_names.add(block.component.options.left_icon)
                if (block.component.options?.right_icon) icon_names.add(block.component.options.right_icon)
            }
        }
    }
}