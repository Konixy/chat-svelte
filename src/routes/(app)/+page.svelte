<script lang="ts">
import { goto } from '$app/navigation';
import { authClient } from '@/lib/auth/auth-client.js';

let { data } = $props();
let user = $derived(data.session.user);

async function signOut() {
	await authClient.signOut({
		fetchOptions: {
			onSuccess: () => {
				goto('/auth');
			}
		}
	});
}
</script>

<!-- TODO: fix that shit -->

<div class="m-6 -mt-11">No conversation selected</div>

<div class="flex h-max w-full flex-1 flex-col items-center justify-center">
	<div class="text-xl">Start chatting, <span class="font-bold">{user.name}</span>!</div>
</div>
