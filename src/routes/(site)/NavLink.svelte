<script lang="ts">
import Icon from "$lib/display/Icon.svelte"
import type { IconComponent } from "$lib/utils/icon_type"

let {
    href,
    text,
    left_icon
} : {
    href: string
    text: string
    left_icon: IconComponent
} = $props()
</script>
<a
    class="nav-link"
    {href}>
    <Icon
        --size="24px"
        icon={left_icon} />
    <div class="text">
        { text }
    </div>
</a>
<style>
.nav-link {
    color: rgba(var(--foreground-rgb), 0.75);
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    padding: 8px;
    outline: 0;
    font-weight: 600;
    border-radius: 4px;

    &:is(:hover, :focus) {
        color: var(--foreground);
        background: rgba(var(--foreground-rgb), 0.04);
    }
}
</style>