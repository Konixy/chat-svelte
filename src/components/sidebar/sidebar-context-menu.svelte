<script lang="ts">
import { UserPlus, UserIcon, Pencil, LogOut, Trash2 } from 'lucide-svelte';
import * as ContextMenu from '../ui/context-menu';
import * as AlertDialog from '../ui/alert-dialog';
import type { Conversation } from '@/lib/types';
import { mutate } from '@/lib/graphql/client';
import ConversationOperations from '@/lib/graphql/operations/conversations';
import { Button, buttonVariants } from '../ui/button';

let { children, conv }: { conv: Conversation; children: any } = $props();

const contextMenuIconClassName = 'mr-2 size-4';

let loading = $state(false);
let canBeLeaved = $derived(conv.participants.length > 3);

function addMembers() {
	console.log('not implemented yet');
}

function viewProfile() {
	console.log('not implemented yet');
}

function editConv() {
	console.log('not implemented yet');
}

async function leaveConv() {
	loading = true;
	await mutate<'leaveConversation', boolean>(ConversationOperations.Mutations.leaveConversation, {
		conversationId: conv.id
	}).catch((e) => {
		console.log(e);
	});
	loading = false;
}

async function deleteConv() {
	loading = true;
	await mutate<'deleteConversation', boolean>(ConversationOperations.Mutations.deleteConversation, {
		conversationId: conv.id
	}).catch((e) => {
		console.log(e);
	});
	loading = false;
}

let dialogOpen = $state(false);

function openDialog(ev: MouseEvent) {
	ev.preventDefault();

	dialogOpen = true;
}
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger>
		{@render children?.()}
	</ContextMenu.Trigger>
	<ContextMenu.Content>
		{#if conv.participants.length > 2}
			<ContextMenu.Item onclick={addMembers}>
				<UserPlus class={contextMenuIconClassName} />
				Add members
			</ContextMenu.Item>
		{:else}
			<ContextMenu.Item onclick={viewProfile}>
				<UserIcon class={contextMenuIconClassName} /> View profile
			</ContextMenu.Item>
		{/if}
		<ContextMenu.Item onclick={editConv}>
			<Pencil class={contextMenuIconClassName} />
			Edit conversation
		</ContextMenu.Item>

		<ContextMenu.Separator />

		<ContextMenu.Item class="data-[highlighted]:bg-destructive" onclick={openDialog}>
			{#if canBeLeaved}
				<LogOut class={contextMenuIconClassName} />
			{:else}
				<Trash2 class={contextMenuIconClassName} />
			{/if}
			{canBeLeaved ? 'Leave conversation' : 'Delete conversation'}
		</ContextMenu.Item>
	</ContextMenu.Content>
</ContextMenu.Root>

<AlertDialog.Root bind:open={dialogOpen}>
	<AlertDialog.Trigger></AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>
				Are you sure you want to {canBeLeaved ? 'leave' : 'delete'} this conversation?
			</AlertDialog.Title>
			<AlertDialog.Description>
				{canBeLeaved
					? 'You can allways be re-added later by any member of the group.'
					: 'This action is irreversible.'}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<Button
				variant="destructive"
				{loading}
				disabled={loading}
				onclick={canBeLeaved ? leaveConv : deleteConv}
			>
				Continue
			</Button>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
