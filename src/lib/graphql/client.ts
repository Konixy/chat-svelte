import type { DocumentNode, GraphQLError } from 'graphql';
import { PUBLIC_GRAPHQL_API, PUBLIC_URL, PUBLIC_WEBSOCKET_API } from '$env/static/public';
import { createClient, type FormattedExecutionResult } from 'graphql-ws/client';
import type { GraphQLResponse } from '../types';

export async function query<N extends keyof any, R>(
	query: DocumentNode,
	fetcher: typeof fetch = fetch,
	headers?: HeadersInit
): Promise<GraphQLResponse<N, R>> {
	const h = new Headers(headers);
	h.set('Accept', 'application/json');
	h.set('Origin', PUBLIC_URL);
	h.set('Content-Type', 'application/json');

	return new Promise((resolve, reject) => {
		fetcher(PUBLIC_GRAPHQL_API, {
			body: JSON.stringify({ query: query.loc?.source.body }),
			headers: h,
			method: 'POST',
			credentials: 'include'
		})
			.then(async (r) => {
				return resolve(await r.json());
			})
			.catch((e) => {
				return reject(e);
			});
	});
}

export async function mutate<N extends keyof any, R, V = Record<string, any>>(
	query: DocumentNode,
	variables: V,
	fetcher: typeof fetch = fetch,
	headers?: HeadersInit
): Promise<GraphQLResponse<N, R>> {
	const h = new Headers(headers);
	h.set('Accept', 'application/json');
	h.set('Origin', PUBLIC_URL);
	h.set('Content-Type', 'application/json');

	return new Promise((resolve, reject) => {
		fetcher(PUBLIC_GRAPHQL_API, {
			body: JSON.stringify({ query: query.loc?.source.body, variables }),
			headers: h,
			method: 'POST',
			credentials: 'include'
		})
			.then(async (r) => {
				return resolve(await r.json());
			})
			.catch((e) => {
				return reject(e);
			});
	});
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
