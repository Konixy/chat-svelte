import { redirect } from '@sveltejs/kit';
import { auth } from '@/lib/auth/server';

export const load = async ({ request }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});

	if (session) {
		if (!session.user.username) {
			return redirect(302, '/auth/finish');
		} else return redirect(302, '/');
	}
};
