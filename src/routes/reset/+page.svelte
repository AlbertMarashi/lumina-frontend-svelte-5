<script lang="ts">
import { goto } from "$app/navigation"
import { page } from "$app/stores"
import Box from "$lib/layouts/Box.svelte"
import Card from "$lib/layouts/Card.svelte"
import Button from "$lib/controls/Button.svelte"
import Password from "$lib/controls/Password.svelte"
import Heading from "$lib/display/Heading.svelte"
import Tag from "$lib/display/Tag.svelte"
import Logo from "$lib/icons/Logo.svelte"
import asyncStatus from "$lib/utils/asyncStatus"
import Send from "svelte-material-icons/Send.svelte"
import ShieldAccount from "svelte-material-icons/ShieldAccount.svelte"
import { login } from "$lib/utils/login.svelte.js"
import { api } from "$lib/utils/api.js"

let {
    data
} = $props()

let password = $state("")

async function reset_password() {
    let { error } = await api<{ error: unknown }>("/api/reset-password", "POST", {
        token: data.token,
        password
    })

    if (error) return $page.data.alerts.create_alert("error", error)

    $page.data.alerts.create_alert("success", "Password reset")

    await login(data.email, password)

    await goto("/")

}
</script>
<div class="flex">
    <Tag text="Auth Portal"/>
    <Logo/>
    <Card
        max_width="600px"
        padding="20px">
        <Box
            gap="16px"
            max_width="400px"
            padding={true}>
            <Heading
                center={true}
                left_icon={ShieldAccount}
                text="Reset Password"/>
            <div class="email">
                { data.email }
            </div>
            <Password
                autocomplete="new-password"
                bind:value={ password }/>
            <Button
                style="branded"
                disabled={!password}
                label="Reset Password"
                onclick={asyncStatus(reset_password)}
                right_icon={Send}/>
        </Box>
    </Card>
</div>
<style>
.email {
    padding: 6px;
    border-radius: 6px;
    border: 1px solid rgba(var(--foreground-rgb), 0.08);
    color: rgba(var(--foreground-rgb), 0.6);
    align-self: center;
}

.flex {
    display: flex;
    height: 100%;
    padding: 36px;
    align-items: center;
    gap: 36px;
    flex-direction: column;
}
</style>