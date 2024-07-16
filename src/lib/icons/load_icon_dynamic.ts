export default async function load_icon_dynamic(name: string, f: typeof fetch = fetch): Promise<string> {
    const res = await f(`/api/icon/${name}`)
    const text = await res.text()
    return text
}