export interface OAuthApp {
    name: string
    scopes: string[]
    redirect_hostnames: string[]
    created: Date
    description: string
    official: boolean
}