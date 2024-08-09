<script lang="ts">
// Flex container

export let gap = 16
export let justify_content: "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "normal" | undefined = undefined
export let align_items: "flex-start" | "center" | "flex-end" | "stretch" | "baseline" | "normal" | undefined = undefined
export let padding = "0"
export let max_width: string | undefined = undefined
export let direction: "row" | "column" = "column"
export let text_align: "left" | "center" | "right" | undefined = undefined
</script>
<div
    style:gap="{ gap }px"
    style:justify-content={ justify_content }
    style:flex-direction={ direction }
    style:padding
    style:text-align={ text_align }
    style:max-width={ max_width }
    style:align-items={ align_items }
    class="layout">
    <slot />
</div>
<style>

.layout {
    display: flex;
}
</style>