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
import { login } from "$lib/utils/login.svelte"

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
    await login(user.email, user.password)
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
                onclick={() => display = DisplayPage.Password}
                right_icon={ChevronRight}
                text="Enter password"/>
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
                    onclick={() => display = DisplayPage.Email}
                    right_icon={SwapHorizontal}
                    text={user.email}/>
            </div>
            <Password
                focus_on_mount={true}
                bind:value={ user.password }/>
            <Button
                style="branded"
                disabled={!user.password}
                onclick={asyncStatus(signin)}
                right_icon={ExitToApp}
                text="Sign In"/>
        {/if}
        <div
            class="forgot-password"
            onclick={() => auth_page = "forgot-password"}
            onkeydown={e => { if (e.key === "Enter") auth_page = "forgot-password" }}
            role="button"
            tabindex="0">Forgot Password?</div>
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