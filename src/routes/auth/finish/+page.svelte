<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import Input from '@/components/ui/input/input.svelte';
	import Label from '@/components/ui/label/label.svelte';

	let { data, form } = $props();
	let user = $derived(data.session.user);

	let username = $state('');
	let valid = $state(false);

	const regex = /^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;

	function oninput(
		e: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) {
		if (e.currentTarget.value.match(regex)) valid = true;
		else valid = false;

		username = e.currentTarget.value.toLocaleLowerCase();
	}
</script>

<main class="mx-auto flex h-screen w-full flex-col items-center justify-center gap-2">
	<div class="text-2xl">One more step, <span class="font-bold">{user.name}</span>!</div>
	<div class="mb-10 text-muted-foreground">We need to know what username would you want to use</div>
	<form action="?/createUsername" method="post" class="flex w-64 flex-col gap-4">
		<Label for="username">Username</Label>
		<Input
			id="username"
			name="username"
			placeholder="johndoe"
			class="transition {!valid && 'ring-2 ring-red-800 ring-offset-2 focus:!ring-red-500'}"
			value={username}
			{oninput}
		/>
		{#if !form?.success && form?.errors}
			<div class="-mt-2 text-red-500">{form.errors[0].message}</div>
		{/if}
		<Button disabled={!valid} type="submit" class="transition">Finish registration</Button>
	</form>
</main>
