<script lang="ts">
import Box from "$lib/layouts/Box.svelte"
import Card from "$lib/layouts/Card.svelte"
import Input from "$lib/controls/Input.svelte"

import Button from "$lib/controls/Button.svelte"
import Email from "svelte-material-icons/Email.svelte"
import ChevronRight from "svelte-material-icons/ChevronRight.svelte"
import ShieldAccount from "svelte-material-icons/ShieldAccount.svelte"
import Heading from "$lib/display/Heading.svelte"
import asyncStatus from "$lib/utils/asyncStatus"
import { api } from "$lib/utils/api"
import { page } from "$app/stores"

let email = $state("")

async function reset_password () {
    let { error } = await api<{ error: unknown }>("/api/forgot-password", "POST", { email })

    if (error) return $page.data.alerts.create_alert("error", error)

    $page.data.alerts.create_alert("success", "Password reset email sent")
}

</script>
<Card padding="24px">
    <Box
        gap="20px"
        max_width="360px">
        <Heading
            center={true}
            left_icon={ShieldAccount}
            text="Reset Password"/>
        <Input
            name="Email"
            autocomplete="email"
            focus_on_mount={true}
            left_icon={Email}
            placeholder="Enter your email"
            type="email"
            bind:value={ email }/>
        <Button
            style="branded"
            disabled={!email.includes("@")}
            label="Send Reset Email"
            onclick={asyncStatus(reset_password)}
            right_icon={ChevronRight}/>
    </Box>
</Card>