<script lang="ts">
import IconButton from "$lib/controls/IconButton.svelte"
import Logo from "$lib/icons/Logo.svelte"
import NavLink from "./NavLink.svelte"
import LuminaUniversity from "$lib/icons/LuminaUniversity.svelte"
import Passport from "svelte-material-icons/Passport.svelte"
import Apps from "svelte-material-icons/Apps.svelte"
import Telescope from "svelte-material-icons/Telescope.svelte"
import FormatListBulleted from "svelte-material-icons/FormatListBulleted.svelte"
import RocketLaunch from "svelte-material-icons/RocketLaunch.svelte"
import NewspaperVariant from "svelte-material-icons/NewspaperVariant.svelte"
import ChevronDoubleLeft from "svelte-material-icons/ChevronDoubleLeft.svelte"
import Settlement from "$lib/icons/Settlement.svelte"
import Button from "$lib/controls/Button.svelte"
import ExitToApp from "svelte-material-icons/ExitToApp.svelte"
import ProfileButton from "$lib/controls/ProfileButton.svelte"
import BellOutline from "svelte-material-icons/BellOutline.svelte"
import DonateButton from "./DonateButton.svelte"
import site_data from "$lib/data/site_data"
import Twitter from "svelte-material-icons/Twitter.svelte"
import Discord from "svelte-material-icons/Discord.svelte"
import TikTok from "$lib/icons/TikTok.svelte"
import Facebook from "svelte-material-icons/Facebook.svelte"
import Youtube from "svelte-material-icons/Youtube.svelte"
import type { GetUserResult } from "$lib/queries"
import { global_state, toggle_theme } from "$lib/stores/global"
import Moon from "svelte-material-icons/WeatherNight.svelte"
import Sun from "svelte-material-icons/WhiteBalanceSunny.svelte"
import Capitol from "$lib/icons/Capitol.svelte"

let {
    sidebar_opened = $bindable(),
    dropdown = $bindable(),
    user = $bindable()
} : {
    sidebar_opened: "default" | boolean
    dropdown: "notifications" | "account" | null
    user: GetUserResult[0][0] | null
} = $props()

function toggle(toggling: "notifications" | "account") {
    if (toggling === dropdown) {
        dropdown = null
    } else {
        dropdown = toggling
    }
}
</script>
<aside
    class:default={ sidebar_opened === "default" }
    class:visible={ sidebar_opened === true }>
    <nav class="content">
        <div class="top">
            <IconButton
                icon={ChevronDoubleLeft}
                onclick={() => sidebar_opened = !sidebar_opened}/>
            <Logo/>
            <spacer></spacer>
            <IconButton
                icon={global_state.inner.dark_mode ? Moon : Sun}
                onclick={() => toggle_theme()}/>
        </div>
        <div class="section">
            <NavLink
                href="/"
                left_icon={Apps}
                text="Dashboard"/>
        </div>
        <section class="section">
            <h4>Services</h4>
            <NavLink
                href="/town-hall"
                left_icon={Capitol}
                text="Town Hall"/>
            <NavLink
                href="/citizenship"
                left_icon={Passport}
                text="Citizenship"/>
            <NavLink
                href="https://luminauniversity.earth"
                left_icon={LuminaUniversity}
                target="_blank"
                text="Lumina University"/>
        </section>
        <div class="section">
            <h4>Information</h4>
            <NavLink
                href="/government-directory"
                left_icon={FormatListBulleted}
                text="Government Directory"/>
            <NavLink
                href="/mission-and-vision"
                left_icon={Telescope}
                text="Mission & Vision"/>
            <NavLink
                href="/milestones"
                left_icon={RocketLaunch}
                text="Milestones"/>
            <NavLink
                href="/media-and-press"
                left_icon={NewspaperVariant}
                text="Media & Press"/>
        </div>
    </nav>
    <div class="content">
        <section class="section">
            <Button
                style="transparent"
                href={site_data.socials.discord}
                label="Join Discord Server"
                left_icon={Discord}
                target="_blank"/>
        </section>
        <div class="section">
            <DonateButton/>
        </div>
        <div class="section">
            <div class="socials">
                <a
                    class="social-media-icon"
                    href={site_data.socials.twitter}><Twitter/></a>
                <a
                    class="social-media-icon"
                    href={site_data.socials.discord}><Discord/></a>
                <a
                    class="social-media-icon"
                    href={site_data.socials.tiktok}><TikTok/></a>
                <a
                    class="social-media-icon"
                    href={site_data.socials.facebook}><Facebook/></a>
                <a
                    class="social-media-icon"
                    href={site_data.socials.youtube}><Youtube/></a>
            </div>
        </div>
        <div class="section">
            {#if user}
                <div class="auth-buttons space-between">
                    <ProfileButton
                        name="{user.first_name} {user.last_name}"
                        onclick={() => toggle("account")}/>
                    <IconButton
                        icon={BellOutline}
                        onclick={() => toggle("notifications")}/>
                </div>
            {:else}
                <div class="auth-buttons">
                    <Button
                        style="branded"
                        href="/auth"
                        hug={false}
                        label="Register"
                        right_icon={Settlement}/>
                    <Button
                        style="translucent"
                        href="/auth"
                        hug={true}
                        right_icon={ExitToApp}/>
                </div>
            {/if}
        </div>
    </div>
</aside>

{#if sidebar_opened === true}
    <div
        class="scrim"
        onclick={() => sidebar_opened = false}
        role="presentation"></div>
{/if}
<style>
aside {
    width: 100%;
    max-width: 300px;
    flex: 1 0 auto;
    justify-content: space-between;
    flex-direction: column;
    display: none;
    background: var(--background);
    z-index: 8;
    border-right: 1px solid rgba(var(--foreground-rgb), 0.1);

    &.visible {
        display: flex;

        @media (max-width: 900px) {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            box-shadow: 0 0 50px rgba(0, 0, 0, 0.4);
            border-right: none;
        }

        @media (max-width: 600px) {
            max-width: none;
            width: 100%;
        }
    }

    @media all and (display-mode: standalone) {
        padding-bottom: 30px;
    }

    &.default {
        display: flex;
        @media (max-width: 900px) {
            display: none;
        }
    }
}

spacer {
    flex: 1;
}
.scrim {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.4);
    z-index: 7;
    display: none;
    @media (max-width: 900px) {
        display: block;
    }
}

.content {
    padding: 8px 0;
    display: flex;
    flex-direction: column;
    gap: 8px;

    & .top {
        display: flex;
        gap: 8px;
        /* justify-content: space-between; */
        padding: 0 8px;
    }

    & .section {
        display: flex;
        padding: 0 8px;
        flex-direction: column;
    }
}

h4 {
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    opacity: 0.3;
    padding-bottom: 8px;
}

.auth-buttons {
    display: flex;
    gap: 8px;

    &.space-between {
        justify-content: space-between;
    }
}

.socials {
    display: flex;
    align-items: center;
    justify-content: space-around;
    gap: 8px;

    & .social-media-icon {
        display: inline-flex;
        font-size: 24px;
        color: var(--foreground);
        opacity: 0.8;
        padding: 8px;
        border-radius: 4px;
        &:hover {
            opacity: 1;
            background: rgba(var(--foreground-rgb), 0.08);
        }
    }
}
</style>
