import type { RegisteredComponent } from "@builder.io/sdk-svelte"
import Heading from "./Heading.svelte"

export default {
    component: Heading,
    name: "Heading",
    // override: true,
    inputs: [
        {
            name: "text",
            type: "text",
            defaultValue: "Enter text here",
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
            name: "level",
            type: "number",
            defaultValue: 1,
            enum: [
                {
                    value: 1,
                    label: "H1",
                },
                {
                    value: 2,
                    label: "H2",
                },
                {
                    value: 3,
                    label: "H3",
                },
                {
                    value: 4,
                    label: "H4",
                },
                {
                    value: 5,
                    label: "H5",
                },
                {
                    value: 6,
                    label: "H6",
                },
            ]
        },
        {
            name: "underline",
            type: "boolean",
            defaultValue: false,
        },
    ],
} satisfies RegisteredComponent