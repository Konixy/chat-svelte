<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import ThemeSwitcher from '@/components/theme-switcher.svelte';
	import Button from '@/components/ui/button/button.svelte';
	import { authClient } from '$lib/auth-client';

	let { data }: { data: PageData } = $props();

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

<ThemeSwitcher class="absolute right-0 top-0 m-10" />

<div class="flex h-screen w-full flex-col items-center justify-center gap-4">
	<div>Logged in as <span class="font-bold">{data.user.name}</span></div>
	<Button onclick={signOut}>Sign out</Button>
</div>
