export async function api<T>(url: string, method: string, body: Record<string, unknown>): Promise<T> {
    const res = await fetch(url, {
        method,
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
        },
    })

    if (!res.ok) {
        throw new Error(await res.json())
    } else {
        return await res.json()
    }
}