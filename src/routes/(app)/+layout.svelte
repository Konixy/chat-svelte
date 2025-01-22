<script lang="ts">
	import AppSidebar from '@/components/app-sidebar.svelte';
	import ThemeSwitcher from '@/components/theme-switcher.svelte';
	import * as Sidebar from '@/components/ui/sidebar/index.js';

	let { data, children } = $props();

	let user = $derived(data.session.user);
	let conversations = $derived(data.conversations.data?.conversations);
	let error = $derived(data.conversations.errors?.[0]);
</script>

<ThemeSwitcher class="absolute right-0 top-0 m-10" />

<Sidebar.Provider style="--sidebar-width: 20rem">
	<AppSidebar {user} conversations={conversations || []} convId={data.convId} />
	<main>
		{#if error}
			<div>{error.message}</div>
		{/if}
		{@render children()}
	</main>
</Sidebar.Provider>
