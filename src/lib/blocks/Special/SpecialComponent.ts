import type { RegisteredComponent } from "@builder.io/sdk-svelte"
import Special from "./Special.svelte"

export default {
    component: Special,
    name: "Special Element",
    // override: true,
    inputs: [
        {
            name: "type",
            type: "string",
            enum: ["beacon"],
            defaultValue: "beacon",
        },
    ],
} satisfies RegisteredComponent