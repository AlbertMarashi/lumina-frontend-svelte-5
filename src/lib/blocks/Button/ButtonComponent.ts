import type { RegisteredComponent } from "@builder.io/sdk-svelte"
import Button from "./Button.svelte"

export default {
    component: Button,
    name: "Button",
    // override: true,
    inputs: [
        {
            name: "text",
            type: "text",
            defaultValue: "Enter text here",
        },
        {
            name: "style",
            type: "string",
            enum: ["branded", "translucent", "transparent"],
            defaultValue: "branded",
        },
        {
            name: "left_icon",
            type: "string",
            defaultValue: null,
        },
        {
            name: "right_icon",
            type: "string",
            defaultValue: null,
        },
        {
            "name": "hug",
            "type": "boolean",
            "defaultValue": true,
        },
    ],
} satisfies RegisteredComponent