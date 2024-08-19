<script lang="ts">
import Alert from "svelte-material-icons/Alert.svelte"
import Info from "svelte-material-icons/AlertCircle.svelte"
import Check from "svelte-material-icons/CheckCircle.svelte"
import {onMount, tick} from "svelte"
import { browser } from "$app/environment"
import type { Message } from "$lib/stores/alerts"
import { page } from "$app/stores"
import Icon from "$lib/display/Icon.svelte"

$: alerts = $page.data.alerts.store

let elements: { [key: symbol]: HTMLDivElement } = {}

let icons = {
    "info": Info,
    "warning": Alert,
    "error": Alert,
    "success": Check
}

function remove(id: symbol){
    $alerts = $alerts.filter(val => val.id !== id)
}

let interval: ReturnType<typeof setInterval> | null = null

function intervalFn () {
    $alerts.shift()
    setBottomHeights()
    $page.data.alerts.store = alerts
}

$: {
    if(browser){
        if($alerts.length === 0 && interval){
            clearInterval(interval)
            interval = null
        } else if($alerts.length !== 0) {
            setBottomHeights()
            if(interval == null) interval = setInterval(intervalFn, 5000)
        }
    }
}

onMount(setBottomHeights)

async function setBottomHeights () {
    await tick()
    let elms = $alerts.map((message: Message) => elements[message.id])
    let heights = 0
    let margin = 10

    for(let i in elms) {
        let el = elms[i]
        let elHeight = el.offsetHeight
        heights += margin
        el.style.bottom = heights + "px"
        heights += elHeight
    }
}

</script>
<div class="action-container-wrapper">
    {#each $alerts as alert}
        <div
            bind:this={ elements[alert.id] }
            class="action-bar"
            class:error={ alert.type === "error" }
            class:info={ alert.type === "info" }
            class:success={ alert.type === "success" }
            class:warning={ alert.type === "warning" }
            role="button"
            tabindex="0"
            on:keypress={ e => {
                if (e.key === "Enter") {
                    remove(alert.id)
                }
            } }
            on:click={ () => remove(alert.id) }>
            <Icon icon={icons[alert.type]}/>
            <div class="text">
                { alert.message }
            </div>
        </div>
    {/each}
</div>
<style>
.action-container-wrapper {
    position: fixed;
    bottom: 10px;
    left: 0;
    right: 0;
    height: 0;
    display: flex;
    align-items: flex-end;
    z-index: 250;
    justify-content: center;

    & .action-bar {
        cursor: pointer;
        background: var(--background);
        position: fixed;
        width: 100%;
        max-width: 500px;
        padding: 8px;
        font-weight: 500;
        box-shadow: 0 0 5px color-mix(in srgb, black, 10%);
        border-radius: 5px;
        z-index: 251;
        color: rgba(var(--foreground-rgb), 1);
        --color: rgba(var(--color-rgb), 1);
        transition: 0.2s ease-in-out;
        display: grid;
        grid-template-columns: min-content 1fr;
        align-items: center;
        border: 2px solid rgba(var(--color-rgb), 1);
        gap: 8px;
        &.warning {
            --color-rgb: var(--yellow-rgb)
        }

        &.error {
            --color-rgb: var(--red-rgb)
        }

        &.success {
            --color-rgb: var(--green-rgb)
        }

        &.info {
            --color-rgb: var(--blue-rgb)
        }
    }
}
</style>