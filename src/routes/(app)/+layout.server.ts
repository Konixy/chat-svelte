import ConversationOperations from '$lib/graphql/operations/conversations';
import { query } from '$lib/graphql/client';
import type { Conversation } from '@/lib/types';
import { redirect } from '@sveltejs/kit';
import { auth } from '@/lib/auth/server';
import { SIDEBAR_COOKIE_NAME } from '@/components/ui/sidebar/constants.js';

export const load = async ({ fetch, request, params, cookies }) => {
	const data = await query<{ conversations: Conversation[] }>(
		ConversationOperations.Query.conversations,
		fetch
	);

	const session = await auth.api.getSession({
		headers: request.headers
	});

	if (!session) {
		return redirect(302, '/auth');
	} else if (!session.user.username) {
		return redirect(302, '/auth/finish');
	}

	return {
		conversations: data,
		session,
		convId: params.convId,
		sidebarOpen: cookies.get(SIDEBAR_COOKIE_NAME) === 'true'
	};
};
