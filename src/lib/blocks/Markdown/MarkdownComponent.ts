import MarkdownRenderer from "$lib/display/MarkdownRenderer.svelte"

export default {
    component: MarkdownRenderer,
    name: "Markdown",
    inputs: [
        {
            name: "markdown",
            type: "longText",
            defaultValue: "This is a **markdown** block",
        },
    ],
}