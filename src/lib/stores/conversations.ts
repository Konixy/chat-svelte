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
				if (conv) {
					if (prev.find((c) => c.id === conv.id)) {
						const i = prev.findIndex((c) => c.id === conv.id);
						if (conv.participants.find((p) => p.user.id === session.user.id)) prev[i] = conv;
						else prev.splice(i, 1);
					} else {
						prev.push(conv);
					}
				} else if (oldConv) {
					if (prev.find((c) => c.id === oldConv.id)) {
						const i = prev.findIndex((c) => c.id === oldConv.id);
						prev.splice(i, 1);
					}
				}

				return prev.sort(
					(a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
				);
			});
		},
		session
	);
}

export { conversations, conversationsSubscribe };
