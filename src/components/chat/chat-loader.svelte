<script lang="ts">
import { Skeleton } from '../ui/skeleton';

let content: { right: boolean; big: boolean }[] = [];

for (let i = 0; i < 100; i++) {
	content.push({
		right: Math.random() > 0.5,
		big: Math.random() > 0.9
	});
}

function rand(min: number, max: number) {
	return Math.floor(Math.random() * (max - min) + min);
}
</script>

<div class="mx-2 flex flex-col-reverse gap-1 overflow-hidden">
	{#each content as c}
		<div class="flex w-full flex-row {c.right ? 'justify-end' : 'justify-start'}">
			<Skeleton
				style="width: {c.big ? '50%' : `${rand(30, 350)}px`}; height: {c.big
					? rand(40, 80)
					: '24'}px"
				class="rounded-lg"
			/>
		</div>
	{/each}
</div>
