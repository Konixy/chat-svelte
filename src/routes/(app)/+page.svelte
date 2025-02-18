<script lang="ts">
import { goto } from '$app/navigation';
import { authClient } from '@/lib/auth/auth-client.js';
import * as Sidebar from '@/components/ui/sidebar';
import Button from '@/components/ui/button/button.svelte';

let { data } = $props();
let user = $derived(data.session.user);
let sidebar = Sidebar.useSidebar();

async function signOut() {
	await authClient.signOut({
		fetchOptions: {
			onSuccess: () => {
				goto('/auth');
			}
		}
	});
}

// $effect(() => {
// 	sidebar.setOpenMobile(true);
// });
</script>

<!-- TODO: fix that shit -->

<div class="m-6 -mt-11 flex items-center gap-2">
	<Sidebar.Trigger class="md:hidden" />
	No conversation selected
</div>

<div class="flex h-max w-full flex-1 flex-col items-center justify-center gap-4">
	<div class="text-xl">Start chatting, <span class="font-bold">{user.name}</span>!</div>
	<div class="text-muted-foreground text-center md:hidden">
		you can eather
		<Button variant="link" class="p-1" onclick={() => sidebar.setOpenMobile(true)}
			>open your conversations</Button
		>
		or
		<Button variant="link" class="p-1">create one</Button>
	</div>
</div>
