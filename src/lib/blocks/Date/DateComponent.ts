import Date from "$lib/display/Date.svelte"
import type { RegisteredComponent } from "@builder.io/sdk-svelte"

export default {
    component: Date,
    name: "Date",
    inputs: [
        {
            name: "Date",
            type: "date",
        },
        {
            name: "Use Ago",
            type: "boolean",
            defaultValue: false,
        },
    ],
} satisfies RegisteredComponent