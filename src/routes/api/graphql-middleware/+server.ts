import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PUBLIC_GRAPHQL_API, PUBLIC_URL } from '$env/static/public';

export const POST: RequestHandler = async ({ request }) => {
	return json(
		await new Promise(async (resolve, reject) => {
			fetch(PUBLIC_GRAPHQL_API, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Origin: PUBLIC_URL,
					Cookie: request.headers.get('cookie') || ''
				},
				body: JSON.stringify(await request.json()),
				credentials: 'include',
				cache: 'no-store'
			})
				.then(async (r) => {
					return resolve(await r.json());
				})
				.catch((e) => {
					return reject(e);
				});
		})
	);
};
