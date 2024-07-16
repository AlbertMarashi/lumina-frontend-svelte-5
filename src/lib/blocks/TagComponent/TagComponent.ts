import Tag from "./Tag.svelte"

export default {
    component: Tag,
    name: "Tag",
    inputs: [
        {
            name: "text",
            type: "text",
            defaultValue: "Tag Text",
        },
    ],
}