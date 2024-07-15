<script lang="ts">
import Box from "$lib/layouts/Box.svelte"
import Card from "$lib/layouts/Card.svelte"
import Input from "$lib/controls/Input.svelte"
import Button from "$lib/controls/Button.svelte"
import Email from "svelte-material-icons/Email.svelte"
import ChevronRight from "svelte-material-icons/ChevronRight.svelte"
import Account from "svelte-material-icons/Account.svelte"
import SwapHorizontal from "svelte-material-icons/SwapHorizontal.svelte"
import ExitToApp from "svelte-material-icons/ExitToApp.svelte"
import Password from "$lib/controls/Password.svelte"
import Segment from "$lib/controls/Segment.svelte"
import Icon from "$lib/display/Icon.svelte"
import ShieldAccount from "svelte-material-icons/ShieldAccount.svelte"
import Web from "svelte-material-icons/Web.svelte"
import Heading from "$lib/display/Heading.svelte"
import asyncStatus from "$lib/utils/asyncStatus"
import mixpanel from "mixpanel-browser";
import { page } from "$app/stores";
import { set_cookie } from "$lib/utils/cookie";
import { invalidateAll } from "$app/navigation";

enum DisplayPage {
    Email,
    Password
}

export let auth_page: string
export let next: () => void

let display = DisplayPage.Email
let user = {
    email: "",
    password: "",
}

async function signin () {
    mixpanel.track("Authenticate", {
        mode: "login",
        method: "email_password"
    })

    const has_redirect = $page.url.searchParams.get("redirect")

    let res = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({
            email: user.email,
            password: user.password,
        }),
    })

    console.log(res)

    if (!res.ok) return $page.data.alerts.create_alert("error", await res.json())

    let data = await res.json() as { token: string }

    console.log(data)

    $page.data.alerts.create_alert("success", "Login Successful")
    set_cookie("token", null)
    set_cookie("token", data.token)
    await invalidateAll()
    next()
}

</script>
<Card padding="24px">
    <Box
        gap="20px"
        max_width="360px">
        <Heading
            center={true}
            left_icon={ShieldAccount}>Login</Heading>
        {#if display === DisplayPage.Email}
            <Input
                name="email"
                autocomplete="email"
                focus_on_mount={true}
                left_icon={Email}
                placeholder="Enter your email"
                type="email"
                bind:value={ user.email }/>
            <Button
                style="branded"
                disabled={!user.email.includes("@")}
                right_icon={ChevronRight}
                text="Enter password"
                onclick={ () => display = DisplayPage.Password }/>
        {/if}
        {#if display === DisplayPage.Password}
            <div class="hidden">
                <Input
                    name="email"
                    autocomplete="email"
                    type="email"
                    bind:value={ user.email }/>
            </div>
            <div class="segment">
                <Segment
                    left_icon={Account}
                    right_icon={SwapHorizontal}
                    text={user.email}
                    onclick={ () => display = DisplayPage.Email }/>
            </div>
            <Password
                focus_on_mount={true}
                bind:value={ user.password }/>
            <Button
                style="branded"
                disabled={!user.password}
                right_icon={ExitToApp}
                text="Sign In"
                onclick={ asyncStatus(signin) }/>
        {/if}
        <div
            class="forgot-password"
            role="button"
            tabindex="0"
            onkeydown={ e => { if (e.key === "Enter") auth_page = "forgot-password" } }
            onclick={ () => auth_page = "forgot-password" }>Forgot Password?</div>
    </Box>
</Card>
<div class="security">
    <span>Protect yourself from phishing attacks. Always check that you are on:</span>
    <div class="browser">
        <Icon
            --opacity={0.5}
            icon={Web}/>
        <div class="url">
            https://lumina.earth
        </div>
    </div>
</div>
<style>
.hidden {
    display: none;
}

.segment {
    display: flex;
    justify-content: center;
}

.security {
    display: flex;
    flex-direction: column;
    align-items: center;

    & span {
        opacity: 0.6;
        text-align: center;
    }
}

.browser {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    margin-top: 10px;
    background: rgba(255, 255, 255, 0.06);
    padding: 10px;
    border-radius: 4px;
}

.forgot-password {
    color: var(--brand);
    font-size: 14px;
    font-weight: 600;
    margin: 0 auto;
    cursor: pointer;
    padding: 8px 8px;
    border-radius: 4px;
    outline: 0;

    &:is(:hover, :focus) {
        background: rgba(255, 255, 255, 0.06);
    }
}
</style>