<script lang="ts">
import Label from "$lib/display/Label.svelte"
import { onMount } from "svelte"

let {
    value = $bindable(),
    label = $bindable(undefined),
    placeholder = $bindable("Enter text"),
    editable = $bindable(true),
    focus_on_mount = $bindable(false),
}: {
    value: string,
    label?: string,
    placeholder?: string,
    editable?: boolean,
    focus_on_mount?: boolean,
} = $props()

let textarea: HTMLTextAreaElement = $state(undefined! as HTMLTextAreaElement)

export function focus() {
    if (textarea) {
        textarea.focus()
        textarea.scrollIntoView({ behavior: "instant" })
    }
}

onMount(() => {
    if(focus_on_mount) {
        focus()
    }
})
</script>
<input-wrapper class:has_label={ label }>
    {#if label}
        <Label text={label}/>
    {/if}
    <div class="grow-wrap">
        <textarea
            bind:this={ textarea }
            class="textarea"
            disabled={!editable}
            placeholder={placeholder}
            rows="1"
            bind:value={ value }></textarea>
        <div class="textarea invisible">{ (value || placeholder) + "\n" }</div>
    </div>
</input-wrapper>
<style>
input-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    &.has_label {
        .grow-wrap {
            margin-top: -8px;
        }
    }
}
.grow-wrap {
    display: grid;
    position: relative;
}
textarea {
    z-index: 1;
}
.textarea {
    border: none;
    padding: 12px 8px;
    margin: 0 -8px;
    line-height: 1.5em;
    font-size: inherit;
    font-weight: inherit;
    background: none;
    font-family: inherit;
    min-height: 0;
    white-space: pre-wrap;
    text-align: inherit;
    grid-area: 1 / 1 / 2 / 2;
    color: rgba(var(--foreground-rgb), 1);
    resize: none;
    overflow: hidden;
    &.invisible {
        visibility: hidden;
    }
    &:focus {
        outline: none;
        border-color: var(--brand);
    }
    &::placeholder {
        color: rgba(var(--foreground-rgb), 0.5);
    }
}
</style>
