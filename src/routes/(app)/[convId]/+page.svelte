<script lang="ts">
import { page } from '$app/state';
import ChatInput from '@/components/chat/chat-input.svelte';
import ChatMessages from '@/components/chat/chat-messages.svelte';
import * as Avatar from '@/components/ui/avatar';
import * as Sidebar from '@/components/ui/sidebar';
import UserAvatar from '@/components/user-avatar.svelte';
import { conversations } from '@/lib/stores/conversations.js';
import type { Conversation } from '@/lib/types.js';
import { subscribeToNewMessages } from '@/lib/stores/messages.js';
import { mutate } from '@/lib/graphql/client.js';
import ConversationOperations from '@/lib/graphql/operations/conversations.js';

let { data } = $props();

let convId = $derived(page.params.convId);
let user = $derived(data.session.user);

let conv = $derived($conversations.find((c) => c.id === convId)) as Conversation;

let parent = $state<HTMLDivElement | null>(null);

$effect(() => {
	const unsubscibe = subscribeToNewMessages(data.session, (m) => {
		if (m.sender.id !== user.id) {
			mutate<'markConversationAsRead', boolean>(
				ConversationOperations.Mutations.markConversationAsRead,
				{ conversationId: convId },
				fetch,
				{ cookie: document.cookie }
			).then((r) => {
				console.log(r);
			});
		}
	});

	return unsubscibe;
});
</script>

<header class="mx-4 -mt-14 mb-6 flex shrink-0 flex-row items-center gap-2 rounded-lg md:mx-8">
	<Sidebar.Trigger class="mr-2 md:hidden" />
	<div class="flex -space-x-4 overflow-hidden">
		{#each conv.participants.filter((p) => p.user.id !== user.id) as p, i (p.id)}
			{#if i < 2 || (i === 2 && conv.participants.length === 4)}
				<UserAvatar user={p.user} class="inline-block size-8 ring-2 ring-transparent" />
			{:else if i === 2}
				<Avatar.Root class="inline-block size-8">
					<Avatar.Fallback>+{conv.participants.length - 3}</Avatar.Fallback>
				</Avatar.Root>
			{/if}
		{/each}
	</div>
	<div class="font-bold">
		{conv.name ||
			conv.participants
				.filter((p) => p.user.id !== user.id)
				.map((e) => e.user.name)
				.join(', ')}
	</div>
</header>

<!-- change that ugly arbitrary value (don't work on mobile and when sidebar closed) -->
<div
	bind:this={parent}
	class="w-screen flex-1 overflow-y-scroll not-md:mb-4 md:w-[calc(100svw-(--spacing(90)))]"
>
	<ChatMessages {user} {parent} />
</div>
<div class="fixed bottom-0 m-2 not-md:w-[calc(100svw-(--spacing(4)))] md:relative">
	<ChatInput {convId} {user} />
</div>
