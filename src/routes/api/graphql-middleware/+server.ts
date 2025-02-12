import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PUBLIC_GRAPHQL_API, PUBLIC_URL } from '$env/static/public';

export const POST: RequestHandler = async ({ request }) => {
	const response = await fetch(PUBLIC_GRAPHQL_API, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Origin: PUBLIC_URL,
			...request.headers
		},
		body: request.body,
		credentials: 'include',
		cache: 'no-store'
	});

	return json(await response.json());
};
