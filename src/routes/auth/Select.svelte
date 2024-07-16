<script lang="ts">
import Icon from "$lib/display/Icon.svelte"
import ArrowRight from "svelte-material-icons/ArrowRight.svelte"
import AccountCircle from "svelte-material-icons/AccountCircle.svelte"
import ExitToApp from "svelte-material-icons/ExitToApp.svelte"
import AccountPlus from "svelte-material-icons/AccountPlus.svelte"
import ChevronRight from "svelte-material-icons/ChevronRight.svelte"
import type { GetUserResult } from "$lib/queries/surreal_queries"

let {
    auth_page = $bindable(),
    user,
    next
}: {
    auth_page: string
    user: GetUserResult[0][0] | null
    next: () => void
} = $props()

let buttons = $derived([
    ...user ? [{
        title: `${user.first_name} ${user.last_name}`,
        icon: AccountCircle,
        action: next,
        description: user.email
    }] : [],
    {
        title: user ? "Use Another Account" : "Login",
        icon: ExitToApp,
        action: () => auth_page = "login",
        description: "Sign into your existing Lumina account"
    },
    {
        title: "Create Account",
        icon: AccountPlus,
        action: () => auth_page = "create",
        description: "Create an account for yourself"
    }
])

</script>
<div class="what-is">
    <h3>What is Lumina?</h3>
    <p>
        Lumina is a planned city-state which aims to create a modern and technologically advanced society grounded in the principles of direct democracy, and freedom.
    </p>
    <p>
        Lumina offers various digital services globally to citizens and non-citizens.
    </p>
    <a href="/mission-and-vision">
        Read Our Mission & Vision
        <Icon
            --size="20px"
            icon={ArrowRight}/>
    </a>
</div>
<div class="buttons">
    {#each buttons as button}
        <button onclick={button.action}>
            <div class="vertical">
                <div class="horizontal">
                    <div class="icon">
                        <Icon icon={button.icon}/>
                    </div>
                    <div class="title">
                        { button.title }
                    </div>
                </div>
                <div class="description">
                    { button.description }
                </div>
            </div>
            <Icon
                --color="var(--brand)"
                --size="28px"
                icon={ChevronRight}/>
        </button>
    {/each}
</div>
<style>
.buttons {
    display: flex;
    flex-direction: column;
    background: rgba(var(--foreground-rgb), 0.04);
    border-radius: 4px;
    width: 100%;
    overflow: hidden;
}

button {
    display: flex;
    align-items: center;
    outline: 0;
    padding: 24px;
    border-top: 1px solid rgba(var(--foreground-rgb), 0.1);

    &:is(:hover, :focus) {
        background: rgba(var(--foreground-rgb), 0.04);
    }

    &:first-child {
        border-top: none;
    }
}

.horizontal {
    display: flex;
    align-items: center;
    gap: 12px;
}

.vertical {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 8px;
    flex: 1;
}

.title {
    font-weight: 600;
    font-size: 18px;
}

.description {
    opacity: 0.6;
}

.icon {
    color: var(--brand);
    display: inline-flex;
    font-size: 28px;
}

.what-is {
    display: flex;
    flex-direction: column;
    padding: 36px 0;
    gap: 18px;

    & a {
        font-weight: 600;
        align-items: center;
        display: flex;
        gap: 8px;
    }
}

h3 {
    opacity: 0.8;
    font-size: 20px;
}

p {
    opacity: 0.6;
    line-height: 1.2em;
    margin: 0;
}
</style>