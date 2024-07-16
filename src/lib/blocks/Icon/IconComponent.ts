import type { RegisteredComponent } from "@builder.io/sdk-svelte"
import Icon from "./Icon.svelte"

export default {
    component: Icon,
    name: "Icon",
    // override: true,
    inputs: [
        {
            name: "name",
            type: "text",
            defaultValue: "Shape",
        },
    ],
} satisfies RegisteredComponent