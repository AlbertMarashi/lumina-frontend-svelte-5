<script lang="ts">
import Icon from "$lib/display/Icon.svelte"
import Tag from "$lib/display/Tag.svelte"
import Web from "svelte-material-icons/Web.svelte"
import type { Organisation } from "./org_types"
import Chip from "$lib/controls/Chip.svelte"
import OpenInNew from "svelte-material-icons/OpenInNew.svelte"
import Circle from "svelte-material-icons/Circle.svelte"

export let organisation: Organisation

</script>
<div class="directory-item">
    <div class="left">
        <div class="name">
            <Icon
                --color={organisation.status === "Halted" ? "rgba(var(--foreground-rgb), 0.2)" : "var(--green)"}
                --size="14px"
                icon={Circle}/>
            { organisation.name }
        </div>
        {#if organisation.officialWebsite}
            <Chip
                href={organisation.officialWebsite}
                label="View Website"
                left_icon={Web}
                right_icon={OpenInNew}
                target="_blank"/>
        {/if}
    </div>
    <div>
        <Tag text={organisation.type}/>
        <Tag
            --color={organisation.status === "Halted" ? "var(--foreground)" : "var(--green)"}
            opacity={organisation.status === "Halted"}
            text={organisation.status}/>
        <!-- <Icon icon={ChevronRight} color="brand" size={24}/> -->
    </div>
</div>
<style>
.directory-item {
    display: flex;
    justify-content: space-between;
    align-items: start;
    padding: 16px;
    border-bottom: 1px solid rgba(var(--foreground-rgb), 0.1);
    gap: 16px;

    & > div {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    &:last-child {
        border-bottom: none;
    }

    .left {
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: start;
        gap: 16px;
    }

    & .name {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 18px;
        font-weight: 700;
    }
}
</style>