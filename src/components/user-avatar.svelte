<script lang="ts">
	import type { User } from '@prisma/client';
	import { Avatar as AvatarPrimitive } from 'bits-ui';
	import * as Avatar from '@/components/ui/avatar';

	let {
		user,
		...cProps
	}: { user: Pick<User, 'image' | 'name' | 'username'> } & AvatarPrimitive.RootProps = $props();

	export function shortenName(name: string): string {
		return name
			.split(' ')
			.map((e, i) => (i < 2 ? e.split('')[0]?.toUpperCase() : ''))
			.join('');
	}
</script>

<Avatar.Root {...cProps}>
	<Avatar.Image src={user.image} alt={user.name} />
	<Avatar.Fallback>{shortenName(user.name)}</Avatar.Fallback>
</Avatar.Root>
