<script lang="ts">
import hljs from "highlight.js"
import ContentCopy from "svelte-material-icons/ContentCopy.svelte"
import Icon from "$lib/display/Icon.svelte"
import "./code-theme.css"

let {
    language,
    code
}: {
    language?: string | null
    code: string
} = $props()

let pre: HTMLPreElement = $state()!
let code_el: HTMLElement = $state()!

let highlighted_code = $derived(hljs.highlight(code, {
    language: language === "pseudocode" || !language ? "plaintext" : language
}))

let lines = $derived(highlighted_code.value.split("\n"))
let digits = $derived(lines.length.toString().length)
let numbers = $derived(lines.map((_, i) => {
    const number = (i + 1).toString()

    return [
        "0".repeat(digits - number.length),
        number,
    ]
}))

function copy() {
    navigator.clipboard.writeText(code)
}

</script>
<pre bind:this={ pre }>
        <div
            class="header"
            class:show-header={ false }>
            <div
                class="copy"
                onclick={copy}
                onkeypress={e => e.key === "Enter" ? copy() : null}
                role="button"
                tabindex="0">
                <Icon icon={ContentCopy}/>
            </div>
        </div>
        <code bind:this={ code_el }>
            <div class="line">
                <div class="number small">{ Array(digits).fill(" ").join("") }</div>
            </div>
            {#each lines as line, i}
                <div class="line">
                    <div class="number"><span class="zero">{ numbers[i][0] }</span>{ numbers[i][1] }</div>
                    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                    <div class="code">{@html line}</div>
                </div>
            {/each}
            <div class="line">
                <div class="number small">{ Array(digits).fill(" ").join("") }</div>
            </div>
        </code>
</pre>
<style>
.copy {
    display: inline-flex;
    cursor: pointer;
    color: var(--foreground-rgb);
    font-size: 20px;
    padding: 6px;
    border-radius: 4px;
    user-select: none;
    color: rgba(var(--foreground-rgb), 0.8);
    background: color-mix(var(--foreground) 15%, var(--background));
    margin-left: auto;
}

.copy:hover,
.copy:active {
    color: var(--foreground-rgb);
    background: rgba(var(--foreground-rgb), 0.1);
}

.header {
    border-bottom: 1px solid rgba(var(--foreground-rgb), 0.1);
    padding: 4px;
    display: contents;
    align-items: center;
    justify-content: space-between;
}

.header.show-header {
    display: flex;
}

.header:not(.show-header) .copy {
    position: absolute;
    top: 0;
    right: 0;
    margin: 10px;
}

.number {
    white-space: pre-wrap;
    color: rgba(var(--foreground-rgb), 0.4);
    user-select: none;
    background: rgba(var(--foreground-rgb), 0.06);
    padding: 0 6px;
    letter-spacing: 2px;
}

.number .zero {
    display: inline;
    opacity: 0.4;
}

.number.small {
    height: 8px;
}

pre {
    position: relative;
    font-size: 12px;
    background: rgba(var(--foreground-rgb), 0.05);
    font-family: "Source Code Pro", monospace;
    border-radius: 4px;
    width: 100%;
    white-space: normal;
}

code {
    width: 100%;
    display: block;
}

.line {
    display: flex;
    gap: 16px;
    padding-right: 16px;
    line-height: 150%;
}

.code {
    white-space: pre-wrap;
}

</style>