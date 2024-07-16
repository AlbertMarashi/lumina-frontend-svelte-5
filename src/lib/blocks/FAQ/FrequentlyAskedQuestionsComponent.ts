import FrequentlyAskedQuestions from "./FrequentlyAskedQuestions.svelte"

export default {
    component: FrequentlyAskedQuestions,
    name: "Questions and Answers",
    inputs: [
        {
            name: "questions",
            type: "array",
            subFields: [
                {
                    name: "open",
                    type: "boolean",
                    defaultValue: false
                },
                {
                    name: "question",
                    type: "blocks",
                    hideFromUI: true,
                    helperText: "Enter the question",
                    defaultValue: [
                        {
                            "@type": "@builder.io/sdk:Element",
                            component: {
                                name: "Plain Text",
                                options: {
                                    text: "Enter the question"
                                }
                            }
                        }
                    ]
                },
                {
                    name: "answer",
                    type: "blocks",
                    hideFromUI: true,
                    helperText: "Enter the answer to the question",
                    defaultValue: [
                        {
                            "@type": "@builder.io/sdk:Element",
                            component: {
                                name: "Text",
                                options: {
                                    text: "Enter the answer to the question"
                                }
                            }
                        }
                    ]
                }
            ]
        }
    ]
}