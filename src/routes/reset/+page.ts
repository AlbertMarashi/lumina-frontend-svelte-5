
export async function load({ data }) {
    return {
        token: data.token,
        email: data.email,
    }
}