import { get_surreal_namespace } from "$lib/utils/surreal_namespace.js"

export async function load({ locals }) {
    return {
        token: locals.token,
        namespace: get_surreal_namespace()
    }
}