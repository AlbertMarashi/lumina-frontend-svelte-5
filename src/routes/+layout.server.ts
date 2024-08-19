import { VERCEL_GIT_COMMIT_REF } from "$env/static/private"

export async function load({ locals }) {
    return {
        token: locals.token,
        namespace: VERCEL_GIT_COMMIT_REF
    }
}