<script lang="ts">
    let { value } = $props()

    const jsonPre = (value) => {
        if(!value) return ""
        if(typeof value === 'string') {
            return JSON.stringify(JSON.parse(value || ""), null, 2)
        } else {
            return JSON.stringify(value || {}, null, 2)
        }
    }

    let parsed = $derived(jsonPre(value))
</script>

<pre>{parsed}</pre>
