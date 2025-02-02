import { writable } from 'svelte/store';
import type { Message, MessageWithLoading } from '../types';
import { SvelteMap } from 'svelte/reactivity';
import { subscribe } from '../graphql/client';
import MessagesOperations from '../graphql/operations/message';

const messages = writable(new SvelteMap<string, MessageWithLoading[]>());

function subscribeToNewMessages(session: any, onNewMessage?: (m: Message) => void) {
	return subscribe<'newMessage', Message>(
		MessagesOperations.Subscription.newMessage,
		(data) => {
			const message = data.data?.newMessage;

			if (message) {
				onNewMessage && onNewMessage(message);

				messages.update((prev) => {
					const convMessages = prev.get(message.conversationId);

					if (convMessages) {
						const oldMessIndex = convMessages.findIndex((e) => e.id === message.id);

						if (oldMessIndex > -1) {
							convMessages[oldMessIndex] = message;
						} else {
							convMessages.push(message);
						}

						prev.set(message.conversationId, [...convMessages]);
					}

					return prev;
				});
			} else {
				console.log(data.errors?.[0]);
			}
		},
		session
	);
}

function addMessage(message: MessageWithLoading) {
	messages.update((prev) => {
		prev.set(message.conversationId, [...(prev.get(message.conversationId) || []), message]);

		return prev;
	});
}

export { messages, addMessage, subscribeToNewMessages };
