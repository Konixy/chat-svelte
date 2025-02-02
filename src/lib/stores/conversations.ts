import { writable } from 'svelte/store';
import type { Conversation, GraphQLResponse } from '../types';
import ConversationOperations from '../graphql/operations/conversations';
import { createClient } from 'graphql-ws/client';
import { PUBLIC_WEBSOCKET_API } from '$env/static/public';
import { subscribe } from '../graphql/client';

const conversations = writable<Conversation[]>();

function conversationsSubscribe(session: any) {
	function unsubscribe() {
		unsubscribe1();
	}

	const unsubscribe1 = subscribe<'conversationUpdated', Conversation>(
		ConversationOperations.Subscriptions.conversationUpdated,
		(data) => {
			const conv = data.data?.conversationUpdated;

			if (conv) {
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

	return unsubscribe;
}

export { conversations, conversationsSubscribe };
