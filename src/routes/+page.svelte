<script lang="ts">
	import type { PageData } from './$types';
	import ThemeSwitcher from '@/components/theme-switcher.svelte';
	import Button from '@/components/ui/button/button.svelte';
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';

	const { user }: PageData = $props();

	$inspect(user);
</script>

<ThemeSwitcher />

<div class="flex h-screen w-full flex-col items-center justify-center">
	<!-- <div>{user.name}</div> -->
	<Button
		onclick={async () =>
			await authClient.signOut({
				fetchOptions: {
					onSuccess: () => {
						goto('/auth');
					}
				}
			})}
	>
		Sign out
	</Button>
</div>
