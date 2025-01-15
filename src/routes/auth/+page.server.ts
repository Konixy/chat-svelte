import { auth } from '$lib/auth.server';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, RequestEvent } from './$types';

export const load: PageServerLoad = async (event: RequestEvent) => {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	if (session) {
		return redirect(302, '/');
	}

	return session;
};
