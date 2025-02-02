<script lang="ts">
import { SendIcon } from 'lucide-svelte';
import Input from '../ui/input/input.svelte';
import { mutate } from '@/lib/graphql/client';
import MessagesOperations from '@/lib/graphql/operations/message';
import { messages } from '@/lib/stores/messages';
import type { User } from '@/lib/types';

let { convId, user }: { convId: string; user: User } = $props();
let value = $state('');

async function onsubmit(e: SubmitEvent) {
	e.preventDefault();

	if (value === '') return;

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

	if (response.data?.sendMessage) {
		console.log('success');
	} else {
		console.log(response.errors?.[0]);
	}
}
</script>

<form {onsubmit} class="flex flex-row">
	<Input
		class="bg-sidebar rounded-xl py-5 pr-10 pl-4"
		placeholder="Write your message here."
		bind:value
	/>
	<button type="submit" class="-ml-8"><SendIcon class="size-5" /></button>
</form>
