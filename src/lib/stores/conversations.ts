import { writable } from 'svelte/store';
import type { Conversation } from '../types';
import ConversationOperations from '../graphql/operations/conversations';
import { subscribe } from '../graphql/client';

const conversations = writable<Conversation[]>();

function conversationsSubscribe(session: any, invalidate: () => Promise<void>): () => void {
	return subscribe<'conversationUpdated', Conversation>(
		ConversationOperations.Subscriptions.conversationUpdated,
		(data) => {
			const conv = data.data?.conversationUpdated;

			if (conv) {
				invalidate();

				conversations.update((prev) => {
					if (prev.find((c) => c.id === conv.id)) {
						const i = prev.findIndex((c) => c.id === conv.id);
						prev[i] = conv;
					} else {
						prev.push(conv);
					}

					return prev.sort(
						(a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
					);
				});
			}
		},
		session
	);
}

export { conversations, conversationsSubscribe };
