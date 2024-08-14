<script lang="ts">

let foo = {
    "left": 123,
    "right": "hello"
}

let side: keyof typeof foo = "right" as keyof typeof foo
</script>
{ foo[side] }
{ foo["left"] }
{ foo.left }