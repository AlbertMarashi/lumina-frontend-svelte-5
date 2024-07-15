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

let email = $state("")

async function reset_password () {
// let res = await $page.data.graph.gmutation(SendPasswordResetEmailDocument, {
    //     email
    // })


    // if (!res.data || res.error) {
    //     $page.data.alerts.create_alert("error", "Failed to send password reset email")
    //     return
    // }

    // $page.data.alerts.create_alert("success", "Password reset email sent")
}

</script>
<Card padding="24px">
    <Box
        gap="20px"
        max_width="360px">
        <Heading
            center={true}
            left_icon={ShieldAccount}>
            Reset Password
        </Heading>
        <Input
            name="email"
            autocomplete="email"
            focus_on_mount={true}
            left_icon={Email}
            placeholder="Enter your email"
            type="email"
            bind:value={ email }/>
        <Button
            style="branded"
            disabled={!email.includes("@")}
            right_icon={ChevronRight}
            text="Send Reset Email"
            on:click={ asyncStatus(reset_password) }/>
    </Box>
</Card>