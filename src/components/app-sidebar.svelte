<script lang="ts">
	import type { User } from 'better-auth';
	import * as Sidebar from './ui/sidebar';
	import Input from './ui/input/input.svelte';
	import type { Conversation } from '$lib/types';
	import CreateConversationModal from './chat/create-conversation-modal.svelte';
	import Button from './ui/button/button.svelte';
	import { useSidebar } from './ui/sidebar';
	import UserAvatar from './user-avatar.svelte';

	let sidebar = useSidebar();

	let {
		user,
		conversations,
		convId
	}: { user: User; conversations: Conversation[]; convId: string | undefined } = $props();
	let modalOpen = $state(false);
</script>

<Sidebar.Root variant="floating" collapsible="icon" class="--sidebar-with=40rem">
	<Sidebar.Header class="flex flex-row">
		{#if sidebar.open}
			<Input type="text" name="Search" placeholder="Search for conversations" />
		{/if}
		<Sidebar.Trigger class="my-1 mr-1 p-4 hover:bg-muted" />
	</Sidebar.Header>
	<Sidebar.Content>
		<Sidebar.Group class="gap-4">
			{#each conversations as conv (conv.id)}
				<a
					href="/{conv.id}"
					class="flex cursor-pointer flex-col gap-1 rounded-lg py-2 pl-3 pr-4 transition {convId ===
					conv.id
						? 'bg-accent'
						: 'hover:bg-secondary-foreground'}"
				>
					<div class="flex flex-row">
						{#each conv.participants as p, i (p.id)}
							{#if i <= 3}
								<UserAvatar user={p.user} class="l-[{i * 4}]" />
							{/if}
						{/each}
					</div>
					<div class="overflow-hidden text-ellipsis text-nowrap font-bold">
						{conv.name || conv.participants.map((p) => p.user.name).join(', ')}
					</div>
					<div>{conv.latestMessage?.body || 'Empty conversation'}</div>
					{#if Math.random() > 0.5}
						<Sidebar.MenuBadge class="-mt-3 rounded-full bg-red-500"
							>{Math.floor(Math.random() * 10)}</Sidebar.MenuBadge
						>
					{/if}
				</a>
			{/each}
		</Sidebar.Group>
	</Sidebar.Content>
	<Sidebar.Footer class="flex flex-col gap-4 text-center">
		<div>Logged in as <span class="font-semibold">{user.name}</span></div>
		<Button onclick={() => (modalOpen = true)}>New conversation</Button>
	</Sidebar.Footer>
</Sidebar.Root>

<CreateConversationModal bind:open={modalOpen} userId={user.id} />
