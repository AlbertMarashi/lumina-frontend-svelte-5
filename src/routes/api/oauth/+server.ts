import { json } from "@sveltejs/kit"
import { z } from "zod"
import type { OAuthApp } from "$lib/types/OAuth"

const apps: Record<string, OAuthApp> = {
    "lumina-university": {
        name: "Lumina University",
        scopes: ["profile:read", "billing", "education"],
        redirect_hostnames: ["localhost", "luminauniversity.earth"],
        created: new Date("2023-05-25T00:00:00.000Z"),
        description: "The next generation of education",
        official: true,
    }
}

const params = z.object({
    slug: z.string(),
})

export async function POST({ request }) {
    const { slug } = params.parse(await request.json())

    return json(apps[slug] || null)
}