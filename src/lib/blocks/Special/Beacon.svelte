<script lang="ts">
import LuminaEdge from "$lib/icons/LogoEdge.svelte"
import Pillar from "./Pillar.svelte"

</script>
<div class="wrapper">
    <div class="logo">
        <LuminaEdge/>
    </div>
    <Pillar/>
</div>
<style>
.wrapper {
    display: inline-flex;
    gap: 8px;
    flex-direction: column;
    align-items: center;
    position: relative;
}

.logo {
    animation: beacon 1.5s ease-in-out infinite;
    font-size: 80px;
    display: inline-flex;
    color: var(--brand);
}

@keyframes beacon {
    0% {
        opacity: 1;
        transform: translateY(0);
    }
    50% {
        opacity: 0.3;
        transform: translateY(-3px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>