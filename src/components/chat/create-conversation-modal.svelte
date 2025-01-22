<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import * as Command from '@/components/ui/command';
	import * as Dialog from '@/components/ui/dialog';
	import { Button } from '@/components/ui/button';
	import { mutate, query } from '@/lib/graphql/client';
	import ConversationOperations from '@/lib/graphql/operations/conversations';
	import UserOperations from '@/lib/graphql/operations/user';
	import type { User as PrismaUser } from '@prisma/client';
	import UserAvatar from '../user-avatar.svelte';
	import { Check } from 'lucide-svelte';

	type User = Omit<PrismaUser, 'email' | 'emailVerified' | 'username'> & {
		username: string;
	};

	let { userId: currentUserId, open = $bindable(false) }: { userId: string; open: boolean } =
		$props();

	let users: User[] | null = $state(null);
	let pIds: string[] = $state([]);
	let loading = $state(false);

	async function getUsers() {
		const response = await query<{ getUsers: User[] }>(UserOperations.Queries.getUsers, fetch, {
			cookie: document.cookie
		});

		if (response.data?.getUsers) users = response.data.getUsers;
	}

	async function createConversation() {
		loading = true;
		const response = await mutate<{ createConversation?: { conversationId: string } }>(
			ConversationOperations.Mutations.createConversation,
			{ participantsIds: [...pIds, currentUserId] },
			fetch,
			{ cookie: document.cookie }
		);

		const convId = response.data?.createConversation?.conversationId;
		console.log(response);
		if (convId) {
			await invalidateAll();
			goto(`/${convId}`);
			loading = false;
			open = false;
			pIds = [];
		}
	}

	function onSelect(user: User) {
		if (pIds.includes(user.id)) return (pIds = pIds.filter((u) => u !== user.id));
		return pIds.push(user.id);
	}

	$effect(() => {
		if (open) getUsers();
	});
</script>

<Command.Dialog bind:open class="outline-none">
	<Dialog.Header class="border-b px-4 pb-4 pt-5">
		<Dialog.Title>Search</Dialog.Title>
		<Dialog.Description>Create a conversation or a group by selecting users</Dialog.Description>
	</Dialog.Header>
	<Command.Input placeholder="Search for users..." disabled={!users} />
	<Command.List>
		<Command.Empty>No user found.</Command.Empty>
		<Command.Group class="p-2">
			{#if users}
				{#each users as user (user.id)}
					<Command.Item class="flex items-center px-2" onclick={() => onSelect(user)}>
						<UserAvatar {user} />
						<div class="ml-2">
							<p class="text-sm font-medium leading-none">{user.name}</p>
							<p class="text-sm text-secondary/80">{user.username}</p>
						</div>
						{#if pIds.includes(user.id)}
							<Check class="ml-auto text-xl text-primary" />
						{/if}
					</Command.Item>
				{/each}
			{/if}
		</Command.Group>
	</Command.List>
	<Dialog.Footer class="flex items-center border-t p-4 sm:justify-between">
		{#if pIds.length > 0 && users}
			<div class="flex -space-x-2 overflow-hidden">
				{#each pIds as id}
					<UserAvatar user={users.find((e) => e.id === id) as User} class="inline-block size-9" />
				{/each}
			</div>
		{:else}
			<p class="text-sm text-muted-foreground">Select users to add to this conversation.</p>
		{/if}
		<!-- <div class="flex flex-row gap-4">
			<button
				class="select-none text-primary/70 transition hover:underline"
				onclick={() => (pIds = [])}>clear</button
			> -->
		<Button {loading} disabled={pIds.length < 1 || loading} onclick={() => createConversation()}
			>Continue</Button
		>
		<!-- </div> -->
	</Dialog.Footer>
</Command.Dialog>
