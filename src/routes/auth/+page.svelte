<script>
	import Button from '@/components/ui/button/button.svelte';
	import { authClient } from '$lib/auth-client';
	import GoogleIcon from '@/components/icons/google-icon.svelte';
	import Favicon from '@/components/icons/favicon.svelte';
	import GithubIcon from '@/components/icons/github-icon.svelte';
	import ThemeSwitcher from '@/components/theme-switcher.svelte';

	let loading = $state(false);

	async function onclick() {
		loading = !loading;

		await authClient.signIn.social({
			provider: 'google'
		});
	}
</script>

<main class="flex h-screen flex-col">
	<div class="flex h-full w-full flex-col items-center justify-center gap-10">
		<div class="flex flex-row items-center gap-4">
			<Favicon class="size-12 fill-foreground" /><span class="text-6xl font-bold">Chat</span>
		</div>
		<Button bind:loading {onclick} contentClass="flex flex-row items-center">
			<GoogleIcon class="mr-3 size-4" />
			Login or Signup with Google
		</Button>
	</div>
	<div
		class="absolute bottom-10 flex w-full flex-col items-center gap-4 text-center text-secondary-foreground dark:text-secondary"
	>
		<div class="flex flex-row items-center gap-2">
			<a
				href="https://github.com/Konixy/chat-svelte"
				target="_blank"
				class="flex size-9 items-center justify-center rounded-md p-1 transition-colors hover:bg-muted dark:hover:bg-secondary-foreground dark:hover:text-white"
				><GithubIcon class="size-5" /></a
			>
			<ThemeSwitcher
				variant="ghost"
				class="hover:bg-muted dark:hover:bg-secondary-foreground [&_svg]:size-5"
			/>
		</div>
		<div>
			A full-stack chat app made with Svelte by
			<a href="https://konixy.fr" target="_blank" class="font-bold hover:underline">Konixy</a>.
		</div>
	</div>
</main>
