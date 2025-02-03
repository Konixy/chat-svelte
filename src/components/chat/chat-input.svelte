<script lang="ts">
import { SendIcon } from 'lucide-svelte';
import Input from '../ui/input/input.svelte';
import { mutate } from '@/lib/graphql/client';
import MessagesOperations from '@/lib/graphql/operations/message';
import { messages } from '@/lib/stores/messages';
import type { User } from '@/lib/types';

let { convId, user }: { convId: string; user: User } = $props();
let value = $state('');
let animate = $state(false);

function onsubmit(e: SubmitEvent) {
	e.preventDefault();

	animate = false;

	setTimeout(() => {
		animate = true;
	}, 50);
}

async function realonsubmit(e: SubmitEvent) {
	e.preventDefault();

	if (value === '') return;

	animate = false;
	setTimeout(() => {
		animate = true;
	}, 10);

	const message = {
		id: crypto.randomUUID(),
		conversationId: convId,
		senderId: user.id,
		body: value
	};

	$messages.set(convId, [
		...($messages.get(convId) || []),
		Object.assign(message, {
			loading: true,
			createdAt: new Date(),
			updatedAt: new Date(),
			sender: user
		})
	]);

	value = '';

	const response = await mutate<'sendMessage', boolean>(
		MessagesOperations.Mutation.sendMessage,
		message,
		fetch,
		{
			cookie: document.cookie
		}
	);

	if (!response.data?.sendMessage) {
		console.log(response.errors?.[0]);
	}
}
</script>

<form {onsubmit} class="flex flex-row">
	<Input
		class="bg-sidebar rounded-xl py-5 pr-10 pl-4 transition focus-visible:ring-2 focus-visible:ring-offset-0"
		placeholder="Write your message here"
		bind:value
	/>
	<button type="submit" class="{animate && 'animate-send'} -ml-9"
		><SendIcon class="size-5" /></button
	>
</form>
