import { redirect } from '@sveltejs/kit';

export async function load({ params, parent }) {
	const { conversations } = await parent();

	const matching = conversations.data?.conversations.filter((c) => c.id === params.convId);

	if (!matching || matching.length !== 1) {
		return redirect(302, '/');
	}

	return { convId: params.convId };
}
