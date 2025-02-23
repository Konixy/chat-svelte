<script lang="ts">
import * as Sidebar from './ui/sidebar';
import * as Tooltip from './ui/tooltip';
import * as ContextMenu from './ui/context-menu';
import Input from './ui/input/input.svelte';
import type { Conversation } from '$lib/types';
import { useSidebar } from './ui/sidebar';
import UserAvatar from './user-avatar.svelte';
import { formatDistance } from 'date-fns';
import { blur } from 'svelte/transition';
import type { User } from '@/lib/types';
import SidebarFooter from './sidebar-footer.svelte';
import CreateConversationModal from './chat/create-conversation-modal.svelte';
import { LogOut, MessageCirclePlus, Pencil, Trash2, UserIcon, UserPlus } from 'lucide-svelte';
import SidebarContextMenu from './sidebar-context-menu.svelte';

let sidebar = useSidebar();

let {
	user,
	conversations,
	convId
}: { user: User; conversations: Conversation[]; convId: string | undefined } = $props();

let modalOpen = $state(false);
</script>

<Sidebar.Root variant="inset" collapsible="icon" class="!z-40">
	<Sidebar.Header class="flex flex-row">
		{#if sidebar.open}
			<Input type="text" name="Search" placeholder="Search for conversations" class="bg-sidebar" />
		{/if}
		<Tooltip.Root>
			<Tooltip.Trigger>
				<Sidebar.MenuButton
					onclick={() => (modalOpen = true)}
					class="flex size-10 items-center justify-center rounded-full p-1"
				>
					<MessageCirclePlus class="size-9" />
				</Sidebar.MenuButton>
			</Tooltip.Trigger>
			<Tooltip.Content>Create conversation</Tooltip.Content>
		</Tooltip.Root>
	</Sidebar.Header>
	<Sidebar.Content class="overflow-x-hidden">
		<Sidebar.Group class="gap-4">
			{#each conversations as conv (conv.id)}
				{@const userParticipant = conv.participants.find((p) => p.user.id === user.id)}
				<SidebarContextMenu {conv}>
					<a
						href="/{conv.id}"
						data-sveltekit-preload-data="off"
						class="relative flex cursor-pointer flex-row items-center gap-3 rounded-lg py-2 pr-4 pl-3 transition {convId ===
						conv.id
							? 'bg-accent text-foreground'
							: 'hover:bg-muted/50 text-foreground/60'}"
						onclick={() => sidebar.setOpenMobile(false)}
					>
						<div>
							<UserAvatar
								user={(conv.latestMessage?.sender.id === user.id
									? undefined
									: conv.latestMessage?.sender) ||
									conv.participants.filter((p) => p.user.id !== user.id)[0].user}
							/>
						</div>
						{#if sidebar.open}
							<div class="flex flex-col gap-1 overflow-hidden" in:blur>
								<div
									class="text-foreground relative overflow-hidden text-sm font-bold text-nowrap text-ellipsis"
								>
									{conv.name ||
										conv.participants
											.filter((p) => p.user.id !== user.id)
											.map((p) => p.user.name)
											.join(', ')}
								</div>
								<div class="relative overflow-hidden text-nowrap text-ellipsis">
									{conv.latestMessage?.body || 'Conversation created'}
								</div>
								<div class="text-sm">
									{formatDistance(new Date(conv.updatedAt), new Date(), {
										addSuffix: true
									})}
								</div>
							</div>
						{/if}
						{#if userParticipant?.unreadMessages && userParticipant.unreadMessages > 0}
							<Sidebar.MenuBadge
								class="absolute top-0 right-0 -m-1 rounded-full bg-red-500 text-white"
								>{userParticipant.unreadMessages}</Sidebar.MenuBadge
							>
						{/if}
					</a>
				</SidebarContextMenu>
			{/each}
		</Sidebar.Group>
	</Sidebar.Content>
	<Sidebar.Footer>
		<SidebarFooter {user} />
	</Sidebar.Footer>
</Sidebar.Root>

<CreateConversationModal bind:open={modalOpen} userId={user.id} />
