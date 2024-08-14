
<script lang="ts">
import Input from "./Input.svelte"
import EyeOutline from "svelte-material-icons/EyeOutline.svelte"
import EyeOffOutline from "svelte-material-icons/EyeOffOutline.svelte"
import Lock from "svelte-material-icons/Lock.svelte"

let visible = false
export let value: string
export let placeholder = "Enter password"
export let autocomplete = "current-password"
export let name = "Password"
export let focus_on_mount = false


</script>
<Input
    name={name}
    autocomplete={autocomplete}
    focus_on_mount={focus_on_mount}
    left_icon={Lock}
    placeholder={placeholder}
    right_icon={visible ? EyeOutline : EyeOffOutline}
    right_icon_handler={() => visible = !visible}
    type={visible ? "text" : "password"}
    on:keyup
    on:keydown
    bind:value={ value }>
</Input>