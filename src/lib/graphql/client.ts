import type { DocumentNode, GraphQLError } from 'graphql';
import { PUBLIC_GRAPHQL_API, PUBLIC_URL } from '$env/static/public';

export async function query<T>(
	query: DocumentNode,
	fetcher: typeof fetch = fetch,
	headers?: HeadersInit
): Promise<{ errors?: GraphQLError[]; data?: T }> {
	const h = new Headers(headers);
	h.set('Accept', 'application/json');
	h.set('Origin', PUBLIC_URL);
	h.set('Content-Type', 'application/json');

	const data = await fetcher(PUBLIC_GRAPHQL_API, {
		body: JSON.stringify({ query: query.loc?.source.body }),
		headers: h,
		method: 'POST',
		credentials: 'include'
	});

	return await data.json();
}

export async function mutate<T, V = Record<string, any>>(
	query: DocumentNode,
	variables: V,
	fetcher: typeof fetch = fetch,
	headers?: HeadersInit
): Promise<{ errors?: GraphQLError[]; data?: T }> {
	const h = new Headers(headers);
	h.set('Accept', 'application/json');
	h.set('Origin', PUBLIC_URL);
	h.set('Content-Type', 'application/json');

	const data = await fetcher(PUBLIC_GRAPHQL_API, {
		body: JSON.stringify({ query: query.loc?.source.body, variables }),
		headers: h,
		method: 'POST',
		credentials: 'include'
	});

	return await data.json();
}
