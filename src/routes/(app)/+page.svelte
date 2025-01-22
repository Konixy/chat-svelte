<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '@/components/ui/button/button.svelte';
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

<div class="flex h-screen w-full flex-col items-center justify-center gap-4">
	<div>Logged in as <span class="font-bold">{user.name}</span></div>
	<Button onclick={signOut}>Sign out</Button>
</div>
