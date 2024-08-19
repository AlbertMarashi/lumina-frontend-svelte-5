import { dev } from "$app/environment"
import { VERCEL_GIT_COMMIT_REF } from "$env/static/private"

export function get_surreal_namespace(): string {
    if (VERCEL_GIT_COMMIT_REF === "main") return "main"
    if (dev) return "development"
    return "preview"
}