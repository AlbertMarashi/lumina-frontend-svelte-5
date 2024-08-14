<script lang="ts">
import Icon from "$lib/display/Icon.svelte"
import { Blocks } from "@builder.io/sdk-svelte"
import ChevronRight from "svelte-material-icons/ChevronRight.svelte"
import ChevronDown from "svelte-material-icons/ChevronDown.svelte"
export let questions: {
    open: boolean,
    question: unknown;
    answer: unknown 
}[] = []
</script>
<faqs>
    {#each questions as {
        question, answer, open 
    }}
        <details bind:open={ open }>
            <summary>
                <Blocks
                    blocks={question}
                    child/>
                <Icon
                    --color="var(--brand)"
                    --size="24px"
                    icon={open ? ChevronDown : ChevronRight} />
            </summary>
            <answer>
                <Blocks
                    blocks={answer}
                    child/>
            </answer>
        </details>
    {/each}
</faqs>
<style>

faqs {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

details {
    border: 1px solid rgba(var(--foreground-rgb), 0.1);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    background: var(--background);
}

summary {
    background-color: rgba(var(--foreground-rgb), 0.05);
    padding: 12px 16px;
    align-items: center;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    font-weight: 700;
}

answer {
    padding: 16px;
    border-top: 1px solid rgba(var(--foreground-rgb), 0.1);
    border-radius: 0 0 8px 8px;
}

</style>