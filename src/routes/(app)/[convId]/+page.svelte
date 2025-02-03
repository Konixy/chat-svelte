<script lang="ts">
import { page } from '$app/state';
import ChatInput from '@/components/chat/chat-input.svelte';
import ChatMessages from '@/components/chat/chat-messages.svelte';
import * as Avatar from '@/components/ui/avatar';
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

let chatRef: HTMLDivElement | undefined = $state();
</script>

<div class="flex h-full flex-col justify-between">
	<div class="bg-sidebar my-2 mr-2 flex flex-row items-center gap-2 rounded-lg border p-4">
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
	</div>
	<div bind:this={chatRef} class="grid grow overflow-x-hidden overflow-y-scroll">
		<ChatMessages {user} parentRef={chatRef} />
	</div>
	<div class="mt-4 mr-3 mb-3 ml-1">
		<ChatInput {convId} {user} />
	</div>
</div>
