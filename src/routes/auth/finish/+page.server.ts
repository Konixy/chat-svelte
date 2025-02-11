import type { PageServerLoad } from './$types';
import type { Actions } from '../$types';
import { redirect } from '@sveltejs/kit';
import { auth } from '@/lib/auth/server';
import { mutate } from '@/lib/graphql/client';
import UserOperations from '@/lib/graphql/operations/user';

export const load: PageServerLoad = async ({ request }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});

	if (!session) redirect(302, '/auth');
	else if (session.user.username) redirect(302, '/');

	return { session };
};

export const actions = {
	createUsername: async (event) => {
		const variables = { username: (await event.request.formData()).get('username') };

		return new Promise((resolve, reject) => {
			mutate<'createUsername', boolean>(
				UserOperations.Mutations.createUsername,
				variables,
				event.fetch
			)
				.catch((e) => {
					console.log(e);

					return reject({ success: false, errors: [e] });
				})
				.then((response) => {
					if (response?.errors) {
						return resolve({ success: false, errors: response.errors });
					}

					return resolve({ success: true });
				});
		});
	}
} satisfies Actions;
