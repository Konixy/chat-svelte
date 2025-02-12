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
		body: JSON.stringify(await request.json()),
		credentials: 'include',
		cache: 'no-store'
	});

	console.log('cookies:' + request.headers.get('cookie'));

	return json(await response.json());
};
