import { auth } from '@/lib/auth/server';
import { json } from '@sveltejs/kit';
import { svelteKitHandler } from 'better-auth/svelte-kit';

export async function handle({ event, resolve }) {
	if (event.url.pathname === '/api/auth/session') {
		const session = await auth.api.getSession({ headers: event.request.headers });
		return json(session);
	}
	return svelteKitHandler({ event, resolve, auth });
}
