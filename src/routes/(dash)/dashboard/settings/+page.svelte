<script lang="ts">
    import { Input, toast } from "$lib/dashboard"
    import type { PageData } from "./$types"
    import { enhance } from "$app/forms"
    import { onMount } from "svelte"

    let { data }: { data: PageData } = $props();
    let opts = $derived(data?.opts)
    let loading = $state(false)
    let mounted = $state(false)

    onMount(() => { mounted = true })
</script>

{#if mounted}
    <form
        class="flex flex-col gap-6 dark:text-gray-400"
        method="post"
        action="?/save"
        use:enhance={() => {
            loading = true
            return async () => {
                loading = false
                toast.success("Options saved")
            }
        }}
    >
        <div class="fieldset">
            <main>
                <div class="py-2 flex flex-col gap-2">
                    <div class="text-2xl">Slack</div>
                    <Input
                        placeholder="Hook"
                        name="slack_hook"
                        bind:value={opts.slack_hook}
                    />
                </div>
            </main>
            <footer class="flex justify-end place-items-center">
                <button type="submit" class="btn w-auto">Save</button>
            </footer>
        </div>
    </form>
{/if}
