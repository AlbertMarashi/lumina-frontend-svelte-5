import { json } from "@sveltejs/kit"
import sgMail from "@sendgrid/mail"
import { SENDGRID_KEY } from "$env/static/private"
import { z } from "zod"
import dedent from "dedent"
import { sign_jwt } from "$lib/utils/jwt.js"
import { surrealdb_admin } from "$lib/stores/surrealdb_admin.js"
import { PasswordResetGetUserQuery } from "$lib/queries.js"

sgMail.setApiKey(SENDGRID_KEY)

const api_inputs = z.object({
    email: z.string().email(),
})

export async function POST({ request }) {
    const { email } = api_inputs.parse(await request.json())

    const [[user]] = await surrealdb_admin.typed(PasswordResetGetUserQuery, { email })

    if (!user) {
        return json({
            status: 404,
            body: { error: "No user found with that email address" }
        })
    }
    const token = await sign_jwt({
        id: user.id.id,
        email
    }, { expiresIn: "1h" })

    const request_url = new URL(request.url)
    request_url.pathname = "/reset"
    request_url.searchParams.set("token", token)
    const resetPasswordLink = request_url.toString()

    try {
        await sgMail.send({
            to: email,
            from: {
                email: "gov@lumina.earth",
                name: "Lumina Government",
            },
            subject: "Reset Your Password",
            text: dedent`
                Hello ${user.first_name} ${user.last_name},

                You are receiving this email because we received a password reset request for your account.

                Please click on the following link, or paste this into your browser to complete the process:

                ${resetPasswordLink}

                This link will expire in 1 hour.

                If you did not request this, please ignore this email and your password will remain unchanged.
            `,
            trackingSettings: {
                clickTracking: {
                    enable: false,
                }
            }
        })
        return json({ success: true })

    } catch (_) {
        return json({
            error: {
                message: "Failed to send password reset email",
                code: "failed_to_send_email"
            }
        }, { status: 500 })
    }
}