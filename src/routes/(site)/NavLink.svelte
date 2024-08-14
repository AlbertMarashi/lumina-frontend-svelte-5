<script lang="ts">
import { page } from "$app/stores"
import Icon from "$lib/display/Icon.svelte"
import type { IconComponent } from "$lib/utils/icon_type"


let {
    href,
    text,
    left_icon,
    target
} : {
    href: string
    text: string
    left_icon: IconComponent,
    target?: string
} = $props()

let path = $derived($page.url.pathname)

let active = $derived(path === href)
let within_active = $derived( href !== "/" && path.length > href.length && path.startsWith(href) )

$inspect(within_active)

</script>
<a
    class="nav-link"
    class:active={ active }
    class:within_active={ within_active }
    {href}
    target={target}>
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
    &.active {
        color: color-mix(in srgb, var(--brand) 50%, var(--foreground));
        background: rgba(var(--brand-rgb), 0.15);
    }

    &.within_active {
        background: rgba(var(--brand-rgb), 0.08);
        color: var(--foreground);
    }

    &:is(:hover, :focus) {
        color: var(--foreground);
        background: rgba(var(--foreground-rgb), 0.04);
    }
}
</style>