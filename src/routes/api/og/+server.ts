import satori from "satori"
import { html } from "satori-html"
import { Resvg } from "@resvg/resvg-js"
import Card from "./Card.svelte"
import CardRaw from "./Card.svelte?raw"
import { render } from "svelte/server"

import UrbanistBold from "./Urbanist-Bold.ttf?arraybuffer"
import UrbanistMedium from "./Urbanist-Medium.ttf?arraybuffer"
import UrbanistSemiBold from "./Urbanist-SemiBold.ttf?arraybuffer"
import { compile } from "svelte/compiler"

export async function GET ({ url }) {

    const title = url.searchParams.get("title") || "No title provided"

    const compiled = compile(CardRaw, {})

    const style = `<style>${compiled.css!.code}</style>`

    const result = render(Card, {
        props: {
            title,
            description: url.searchParams.get("description"),
        },
    })

    const svg = await satori(html(result.body + style), {
        fonts: [
            {
                name: "Prompt",
                weight: 700,
                style: "normal",
                data: UrbanistBold,
            },
            {
                name: "Prompt",
                data: UrbanistMedium,
                weight: 500,
                style: "normal",
            },
            {
                name: "Prompt",
                data: UrbanistSemiBold,
                weight: 600,
                style: "normal",
            },
        ],
        height: 630,
        width: 1200,
    })

    const resvg = new Resvg(svg, {})

    const pngData = resvg.render()
    const pngBuffer = pngData.asPng()

    return new Response(pngBuffer, {
        headers: {
            "Content-Type": "image/png",
        },
    })
}