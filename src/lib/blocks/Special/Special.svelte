<script lang="ts">
import type { Component } from "svelte"
import Beacon from "./Beacon.svelte"

let {
    type,
} = $props<{
    type: "beacon"
}>()

const components: Record<string, Component> = {
    beacon: Beacon,
}

let Special = $derived(components[type])
</script>
<Special/>