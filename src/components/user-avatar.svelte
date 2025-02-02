<script lang="ts">
import type { User } from '@/lib/types';
import { Avatar as AvatarPrimitive } from 'bits-ui';
import * as Avatar from '@/components/ui/avatar';

let {
	user,
	squared,
	...cProps
}: {
	user: Pick<User, 'image' | 'name' | 'username'>;
	squared?: boolean;
} & AvatarPrimitive.RootProps = $props();

export function shortenName(name: string): string {
	return name
		.split(' ')
		.map((e, i) => (i < 2 ? e.split('')[0]?.toUpperCase() : ''))
		.join('');
}
</script>

<Avatar.Root class="{squared ? 'rounded-lg' : ''} {cProps.class}" {...cProps}>
	<Avatar.Image class={squared ? 'rounded-lg' : ''} src={user.image} alt={user.name} />
	<Avatar.Fallback class={squared ? 'rounded-lg' : ''}>{shortenName(user.name)}</Avatar.Fallback>
</Avatar.Root>
