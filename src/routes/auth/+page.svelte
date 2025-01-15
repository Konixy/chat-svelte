<script>
	import Button from '@/components/ui/button/button.svelte';
	import { authClient } from '$lib/auth-client';

	let loading = $state(false);

	async function onclick() {
		loading = !loading;

		await authClient.signIn.social({
			provider: 'google'
		});
	}
</script>

<div class="flex h-[100vh] w-full flex-col items-center justify-center">
	<div>Please login</div>
	<Button bind:loading {onclick}>Login with Google</Button>
</div>
