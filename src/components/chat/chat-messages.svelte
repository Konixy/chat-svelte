<script lang="ts">
import { page } from '$app/state';
import { mutate as query } from '@/lib/graphql/client';
import MessagesOperations from '@/lib/graphql/operations/message';
import { conversations } from '@/lib/stores/conversations';
import { messages as messagesStore } from '@/lib/stores/messages';
import type { Message, User } from '@/lib/types';
import UserAvatar from '../user-avatar.svelte';
import * as Tooltip from '../ui/tooltip';
import { Loader2 } from 'lucide-svelte';
import { fade } from 'svelte/transition';
import ChatLoader from './chat-loader.svelte';

let convId = $derived(page.params.convId);
let messages = $derived($messagesStore.get(convId));
let conv = $derived($conversations.find((c) => c.id === convId));
let isGroup = $derived((conv?.participants.length || 0) > 2);

let { user, parent }: { user: User; parent: HTMLDivElement | null } = $props();

async function loadMessages() {
	let convIdSnapshot = $state.snapshot(convId);

	const messages = await query<'messages', Message[]>(
		MessagesOperations.Query.messages,
		{
			conversationId: convId
		},
		fetch
	);

	if (messages.data?.messages) {
		$messagesStore.set(convIdSnapshot, messages.data.messages);
	}
}

$effect(() => {
	loadMessages();

	parent?.scrollTo({
		top: parent.scrollHeight
	});
});
</script>

{#if messages}
	{#if messages.length === 0}
		<div class="text-foreground/30 mt-10 flex flex-col items-center text-lg">
			<div>Oh, it looks like this conversation isn't started yet...</div>
			<div>Start it by sending the first message!</div>
		</div>
	{:else}
		<div class="mx-2 flex flex-col-reverse not-md:mb-10">
			{#each messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) as message, i (message.id)}
				{@const sentByMe = message.sender.id === user.id}
				{@const seenBy = conv?.participants
					.filter((p) => p.user.id !== user.id)
					.filter((p) => p.lastSeenMessageId === message.id)
					.filter((p) => p.user.id !== message.sender.id)}
				{@const prevMessage = messages.length > i + 1 && messages[i + 1]}
				{@const prevIsSameSender = prevMessage && prevMessage.sender.id === message.sender.id}
				{@const nextMessage = i > 0 && messages[i - 1]}
				{@const nextIsSameSender = nextMessage && nextMessage.sender.id === message.sender.id}

				<div
					class="flex flex-row {prevIsSameSender ? 'mt-1' : 'mt-2'} {sentByMe
						? 'justify-end'
						: 'justify-start'}"
				>
					<div class="flex w-full flex-col gap-1 {sentByMe && 'text-right'}">
						{#if isGroup && !sentByMe && !prevIsSameSender}
							<div class="flex flex-row items-center gap-1 text-sm">
								<UserAvatar class="size-4" user={message.sender} />{message.sender.name}
							</div>
						{/if}
						<div>
							<div
								class="inline-block max-w-2/3 rounded-t-2xl rounded-b-2xl px-2 py-1 text-left text-wrap break-words transition {sentByMe
									? `text-primary-foreground float-end ${prevIsSameSender && 'rounded-tr-sm'} ${nextIsSameSender && 'rounded-br-sm'} ${message.loading ? 'bg-primary/80' : 'bg-primary'}`
									: `bg-muted ${prevIsSameSender && 'rounded-tl-sm'} ${nextIsSameSender && 'rounded-bl-sm'}`}"
							>
								{message.body}
							</div>
							{#if message.loading}
								<Loader2
									class="text-muted-foreground float-end inline-block size-8 animate-spin py-2"
								/>
							{/if}
						</div>
						{#if seenBy && seenBy.length > 0 && (isGroup || !sentByMe)}
							<div
								class="text-foreground/60 flex flex-row items-center justify-end text-sm {sentByMe &&
									'text-right'}"
							>
								{#if isGroup}
									Seen by
									{#each seenBy as p (p.id)}
										<Tooltip.Root>
											<Tooltip.Trigger>
												<UserAvatar class="ml-1 size-4" user={p.user} />
											</Tooltip.Trigger>
											<Tooltip.Content class="text-center">
												<div>{p.user.name}</div>
												<div class="text-muted-foreground text-sm">{p.user.username}</div>
											</Tooltip.Content>
										</Tooltip.Root>
									{/each}
								{:else}
									Seen
								{/if}
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
{:else}
	<ChatLoader />
{/if}
