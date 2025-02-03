<script>
import RainbowButton from '@/components/ui/rainbow-button';
import { authClient } from '@/lib/auth/auth-client';
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
		<div class="flex flex-row items-center gap-3">
			<Favicon class="fill-foreground size-12" /><span class="text-6xl font-bold">Chat</span>
		</div>
		<RainbowButton {onclick} class="flex flex-row items-center">
			<GoogleIcon class="mr-3 size-4" />
			Login or Signup with Google
		</RainbowButton>
	</div>
	<div
		class="text-muted-foreground absolute bottom-10 flex w-full flex-col items-center gap-4 text-center"
	>
		<div class="flex flex-row items-center gap-2">
			<a
				href="https://github.com/Konixy/chat-svelte"
				target="_blank"
				class="hover:bg-muted hover:text-foreground flex size-9 items-center justify-center rounded-md p-1 transition-colors"
				><GithubIcon class="size-5" /></a
			>
			<ThemeSwitcher
				variant="ghost"
				class="hover:bg-muted transition-colors [&_svg]:size-5 [&_svg]:transition-none"
			/>
		</div>
		<div>
			A full-stack chat app made with Svelte by
			<a href="https://konixy.fr" target="_blank" class="font-bold hover:underline">Konixy</a>.
		</div>
	</div>
</main>
