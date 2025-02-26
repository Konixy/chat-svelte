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
			if (!message) {
				console.error('Error receiving new message:', data.errors?.[0]);
				return;
			}

			onNewMessage?.(message);

			messages.update((prev) => {
				const convMessages = prev.get(message.conversationId);
				if (!convMessages) return prev;

				const updatedMessages = [...convMessages];
				const existingIndex = updatedMessages.findIndex((msg) => msg.id === message.id);

				if (existingIndex > -1) {
					updatedMessages[existingIndex] = message;
				} else {
					updatedMessages.push(message);
				}

				prev.set(message.conversationId, updatedMessages);
				return prev;
			});
		},
		session
	);
}

function addMessage(message: MessageWithLoading) {
	messages.update((prev) => {
		const existingMessages = prev.get(message.conversationId) || [];
		prev.set(message.conversationId, [...existingMessages, message]);
		return prev;
	});
}

export { messages, addMessage, subscribeToNewMessages };
