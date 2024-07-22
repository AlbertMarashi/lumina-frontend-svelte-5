<script lang="ts">
export let text: string

</script>
<div class="label">
    { text }
</div>
<style>
.label {
    font-size: 14px;
    font-weight: 800;
    color: rgba(var(--foreground-rgb), 0.5);
    padding: 0 12px;
    padding-top: 0;
    margin: 0 -12px;
}
</style>