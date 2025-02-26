<script lang="ts">
import { invalidateAll } from '$app/navigation';
import { page } from '$app/state';
import AppSidebar from '@/components/sidebar/app-sidebar.svelte';
import * as Sidebar from '@/components/ui/sidebar';
import { conversationsSubscribe, conversations } from '@/lib/stores/conversations';

let { data, children } = $props();

let user = $derived(data.session.user);
let convs = data.conversations.data?.conversations;
let error = data.conversations.errors?.[0];
let convId: string | undefined = $derived(page.params.convId);

$conversations =
	convs?.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()) || [];

let totalUnread = $derived(
	$conversations?.reduce(
		(acc, conv) =>
			acc + (conv.participants.find((p) => p.user.id === user.id)?.unreadMessages || 0),
		0
	) || 0
);

$effect(() => {
	const unsubscibe = conversationsSubscribe(data.session, invalidateAll);

	return unsubscibe;
});
</script>

<svelte:head>
	<title>
		{totalUnread > 0 ? `(${totalUnread}) ` : ''}Chat
	</title>
</svelte:head>

<Sidebar.Provider open={data.sidebarOpen}>
	<AppSidebar {user} conversations={$conversations || []} {convId} />
	<Sidebar.Inset
		class="!mt-20 max-h-[calc(100svh-(--spacing(22)))] min-h-[calc(100svh-(--spacing(22)))] !rounded-2xl"
	>
		{@render children()}
	</Sidebar.Inset>
</Sidebar.Provider>
