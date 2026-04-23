<script lang="ts">
    import { onDestroy, onMount, type Snippet } from "svelte";

    let { query, children }: { query: string; children: Snippet } = $props()

    let mql;
    let mqlListener;
    let wasMounted = $state(false);
    let matches = $state(false);

    onMount(() => {
        wasMounted = true;
        return () => {
            removeActiveListener();
        };
    });

    onDestroy(() => {
        removeActiveListener();
    })

    $effect(() =>  {
        if (wasMounted) {
            removeActiveListener();
            addNewListener(query);
        }
    })

    function addNewListener(query) {
        mql = window.matchMedia(query);
        mqlListener = v => matches = v.matches;
        mql.addEventListener("change", mqlListener);
        matches = mql.matches;
    }

    function removeActiveListener() {
        if (mql && mqlListener) removeEventListener("change", mqlListener)
    }
</script>

{#if matches}
    {@render children?.()}
{/if}
