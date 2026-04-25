<script lang="ts">
    import { Drawer } from "$lib/dashboard";
    let { item } = $props()
    let show = $state(false)
</script>

<button onclick={() => show = true} class="p-2 bg-white rounded-lg">
    <img src={item.qr} alt="qr" class="rounded-lg w-40">
</button>

{#if show}
    <Drawer bind:open={show}>
        <div class="flex-center ">
            <div class="text-center">
                <div>
                    Google Authenticator for: <b>{item.name}</b>
                </div>
                <div>{item.email}</div>
                <div class="p-2 bg-white rounded-lg my-4">
                    <img src={item.qr} alt="qr" style="width:400px;">
                </div>

                <div class="text-xs">
                    Scan the code from Google Authenticator app
                </div>
            </div>
        </div>
    </Drawer>
{/if}
