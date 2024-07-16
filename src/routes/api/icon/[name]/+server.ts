export async function GET({ params }) {
    return new Response(await(await fetch("https://icons.siteforge.io/api/icon/" + params.name)).text())
}