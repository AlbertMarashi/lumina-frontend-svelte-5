import type { ComponentProps } from "svelte"
import type Statement from "./Statement.svelte"


export async function load() {
    const debate = {
        current: {
            id: "1",
            laughs: 0,
            rating: 2,
            replying: {
                to: {
                    id: "2",
                    laughs: 0,
                    rating: 2,
                    replying: {
                        to: {
                            id: "3",
                            rating: 2,
                            author: "John Doe",
                            laughs: 0,
                            total_replies: 0,
                            created_at: new Date(),
                            content: "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum"
                        },
                        side: "against"
                    },
                    author: "Jane Doe",
                    total_replies: 0,
                    created_at: new Date(),
                    content: "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum"
                },
                side: "support"
            },
            author: "John Doe",
            total_replies: 0,
            created_at: new Date(),
            content: "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum"
        },
        support: [
            {
                id: "3",
                rating: 5,
                author: "John Doe",
                laughs: 0,
                total_replies: 5,
                created_at: new Date(),
                content: "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum"
            },
            {
                id: "4",
                rating: 3,
                author: "John Doe",
                laughs: 0,
                total_replies: 3,
                created_at: new Date(),
                content: "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum"
            },
            {
                id: "5",
                rating: 2,
                laughs: 0,
                author: "John Doe",
                total_replies: 1,
                created_at: new Date(),
                content: "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum"
            }
        ],
        against: [
            {
                id: "6",
                rating: 5,
                author: "John Doe",
                laughs: 0,
                total_replies: 0,
                created_at: new Date(),
                content: "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum"
            },
            {
                id: "7",
                rating: 4,
                author: "John Doe",
                laughs: 0,
                total_replies: 0,
                created_at: new Date(),
                content: "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum"
            },
            {
                id: "8",
                rating: 2,
                laughs: 0,
                author: "John Doe",
                total_replies: 0,
                created_at: new Date(),
                content: "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum"
            }
        ]
    } satisfies {
        current: ComponentProps<Statement>["statement"],
        support: ComponentProps<Statement>["statement"][],
        against: ComponentProps<Statement>["statement"][]
    }
    return {
        debate
    }
}