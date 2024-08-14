<script lang="ts">

const {
    src,
    author,
}: {
    src?: string,
    author: string,
} = $props()

</script>
<div class="author">
    {#if src}
        <img
            class="author_img"
            alt="{author} profile picture"
            src={src}>
    {/if}
    <div class="author_name">
        { author }
    </div>
</div>
<style>
    .author {
        display: flex;
        flex-direction: row;
        gap: 8px;
        align-items: center;
        font-size: 14px;
        color: var(--foreground);
    }

    .author_img {
        width: 24px;
        height: 24px;
        border-radius: 100px;
    }

    .author_name {
        font-weight: 600;
    }
    </style>