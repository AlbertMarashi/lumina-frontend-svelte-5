<script lang="ts">
import ShieldAccount from "svelte-material-icons/ShieldAccount.svelte"
import Email from "svelte-material-icons/Email.svelte"
import Input from "$lib/controls/Input.svelte"
import Button from "$lib/controls/Button.svelte"
import Password from "$lib/controls/Password.svelte"
import PhoneInput from "$lib/controls/PhoneInput.svelte"
import type { Country } from "$lib/data/countries"
import Card from "$lib/layouts/Card.svelte"
import Box from "$lib/layouts/Box.svelte"
import Icon from "$lib/display/Icon.svelte"
import asyncStatus from "$lib/utils/asyncStatus"
import { page } from "$app/stores"
import { safe_db } from "$lib/stores/database"
import { CreateUserQuery } from "$lib/queries"
import mixpanel from "mixpanel-browser"
import { login } from "$lib/utils/login.svelte"

let {
    next
}: {
    next: () => void
} = $props()


let user = $state({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
})

let phone: {
    country: Country | null,
    number: string
} = $state({
    country: null,
    number: "",
})

let invalid = $derived(!(
    user.email &&
    user.password &&
    user.first_name &&
    user.last_name &&
    phone.country &&
    phone.number
))

async function signup () {
    if (invalid || !phone.country) return
    const db = await safe_db()
    try {
        // let referrer = localStorage.getItem("referral")

        let [created] = await db.typed(CreateUserQuery, {
            email: user.email,
            password: user.password,
            first_name: user.first_name,
            last_name: user.last_name,
            phone_number: phone.number,
            country_code: phone.country.code,
            calling_code: phone.country.calling_code,
        // TODO: referrer: undefined,
        })

        if (!created) return $page.data.alerts.create_alert("error", {
            code: "FAILED_ACCOUNT_CREATION",
            message: "Failed to create account"
        })

        mixpanel.track("Create Account", {
            country_code: phone.country.code,
        })

        $page.data.alerts.create_alert("success", "Account Created")
    } catch (e) {
        return $page.data.alerts.create_alert("error", {
            code: "FAILED_ACCOUNT_CREATION",
            message: e
        })
    }

    await login(user.email, user.password)
    next()
}
</script>
<Card padding="24px">
    <Box
        gap="20px"
        max_width="360px">
        <h1>
            <Icon
                --color="var(--brand)"
                --size="32px"
                icon={ShieldAccount}/>
            Create Account
        </h1>
        <!-- <div class="center">
                <ProfilePicker />
            </div> -->
        <Input
            name="Email"
            autocomplete="email"
            focus_on_mount={true}
            left_icon={Email}
            placeholder="eg: john@example.com"
            bind:value={ user.email }
        />
        <PhoneInput bind:value={ phone }/>
        <div class="split">
            <Input
                name="First Name"
                autocomplete="given-name"
                placeholder="eg: John"
                bind:value={ user.first_name }
            />
            <Input
                name="Last Name"
                autocomplete="family-name"
                placeholder="eg: Smith"
                bind:value={ user.last_name }
            />
        </div>
        <Password
            autocomplete="new-password"
            bind:value={ user.password }/>
        <Button
            style="branded"
            disabled={invalid}
            label="Create Account"
            onclick={asyncStatus(signup)}
            right_icon={ShieldAccount}/>
    </Box>
</Card>
<style>
.split {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    gap: 20px;
}

h1 {
    margin: 0;
    gap: 10px;
    text-align: center;
    display: flex;
    font-size: 28px;
    align-items: center;
    justify-content: center;
    font-weight: 600;
}
</style>