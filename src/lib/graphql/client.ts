import type { DocumentNode } from 'graphql';
import { PUBLIC_GRAPHQL_API, PUBLIC_URL, PUBLIC_WEBSOCKET_API } from '$env/static/public';
import { createClient, type FormattedExecutionResult } from 'graphql-ws/client';
import type { GraphQLResponse } from '../types';
import { error } from '@sveltejs/kit';

const middlewarePath = PUBLIC_URL + '/api/graphql-middleware';

export async function query<N extends keyof any, R>(
	query: DocumentNode,
	fetcher: typeof fetch = fetch,
	headers?: HeadersInit
): Promise<GraphQLResponse<N, R>> {
	// const h = new Headers(headers);
	// h.set('Accept', 'application/json');
	// h.set('Origin', PUBLIC_URL);
	// h.set('Content-Type', 'application/json');

	try {
		const response = await fetcher(middlewarePath, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Origin: PUBLIC_URL,
				...headers
			},
			body: JSON.stringify({
				query: query.loc?.source.body
			}),
			credentials: 'include',
			mode: 'cors',
			cache: 'no-store' // Important for SvelteKit 2.x
		});

		if (!response.ok) {
			error(response.status, response.statusText);
		}

		return await response.json();
	} catch (error) {
		console.error('GraphQL mutation error:', error);
		throw error;
	}
}

export async function mutate<N extends keyof any, R, V = Record<string, any>>(
	query: DocumentNode,
	variables: V,
	fetcher: typeof fetch = fetch,
	headers?: HeadersInit
): Promise<GraphQLResponse<N, R>> {
	// const h = new Headers(headers);
	// h.set('Accept', 'application/json');
	// h.set('Origin', PUBLIC_URL);
	// h.set('Content-Type', 'application/json');

	try {
		const response = await fetcher(middlewarePath, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Origin: PUBLIC_URL,
				...headers
			},
			body: JSON.stringify({
				query: query.loc?.source.body,
				variables
			}),
			credentials: 'include',
			mode: 'cors',
			cache: 'no-store' // Important for SvelteKit 2.x
		});

		if (!response.ok) {
			error(response.status, response.statusText);
		}

		return await response.json();
	} catch (error) {
		console.error('GraphQL mutation error:', error);
		throw error;
	}
}

export function subscribe<N extends keyof any, R>(
	query: DocumentNode,
	callback: (data: FormattedExecutionResult<{ [key in N]: R }, unknown>) => void,
	session: any
) {
	const wsClient = createClient({
		url: PUBLIC_WEBSOCKET_API,
		connectionParams() {
			return { session };
		}
	});

	return wsClient.subscribe<{ [key in N]: R }>(
		{ query: query.loc?.source.body as string },
		{
			next(data) {
				callback(data);
			},
			complete() {},
			error(e) {
				console.log(e);
			}
		}
	);
}
