import { writable } from 'svelte/store';
import type { Conversation, Session } from '../types';
import ConversationOperations from '../graphql/operations/conversations';
import { subscribe } from '../graphql/client';

const conversations = writable<Conversation[]>();

function conversationsSubscribe(session: Session, invalidate: () => Promise<void>): () => void {
	return subscribe<
		'conversationUpdated',
		{ oldConversation: Conversation; newConversation: Conversation }
	>(
		ConversationOperations.Subscriptions.conversationUpdated,
		(data) => {
			const oldConv = data.data?.conversationUpdated.oldConversation;
			const conv = data.data?.conversationUpdated?.newConversation;

			invalidate();
			conversations.update((prev) => {
				let updated = [...prev];

				if (conv) {
					const index = updated.findIndex((c) => c.id === conv.id);
					if (index !== -1) {
						if (conv.participants.find((p) => p.user.id === session.user.id)) {
							updated[index] = conv;
						} else {
							updated.splice(index, 1);
						}
					} else {
						updated.push(conv);
					}
				} else if (oldConv) {
					updated = updated.filter((c) => c.id !== oldConv.id);
				}

				return updated.sort(
					(a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
				);
			});
		},
		session
	);
}

export { conversations, conversationsSubscribe };
