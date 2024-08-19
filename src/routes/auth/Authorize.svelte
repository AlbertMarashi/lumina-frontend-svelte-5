<script lang="ts">
import Icon from "$lib/display/Icon.svelte"
import type { GetUserResult } from "$lib/queries"
import AccountCircle from "svelte-material-icons/AccountCircle.svelte"
import SwapHorizontal from "svelte-material-icons/SwapHorizontal.svelte"

export let auth_page: string
export let user: GetUserResult[0][0]

</script>
<button on:click={ () => auth_page = "select" }>
    <div class="vertical">
        <div class="horizontal">
            <div class="icon">
                <AccountCircle/>
            </div>
            <div class="title">
                { user.first_name } { user.last_name }
            </div>
        </div>
        <div class="description">
            { user.email }
        </div>
    </div>
    <Icon
        --color="var(--brand)"
        --size="28px"
        icon={SwapHorizontal}/>
</button>
<style>
button {
    background: rgba(var(--foreground-rgb), 0.08);
    display: flex;
    align-items: center;
    border-radius: 4px;
    outline: 0;
    padding: 24px;
    width: 100%;
    &:is(:hover, :focus) {
        background: rgba(var(--foreground-rgb), 0.04);
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
</style>