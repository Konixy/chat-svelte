<script lang="ts">
	import { Sun, Moon, Monitor } from 'lucide-svelte';

	import { setMode } from 'mode-watcher';
	import * as DropdownMenu from '@/components/ui/dropdown-menu/index';
	import {
		buttonVariants,
		type ButtonSize,
		type ButtonVariant
	} from '@/components/ui/button/index';

	let {
		class: className,
		variant = 'outline',
		size = 'icon',
		...Props
	}: { class?: string; variant?: ButtonVariant; size?: ButtonSize; [prop: string]: any } = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="{buttonVariants({ variant, size })} flex items-center justify-center {className}"
		{...Props}
	>
		<Sun class="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
		<Moon
			class="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
		/>
		<span class="sr-only">Toggle theme</span>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="center">
		<DropdownMenu.Item onclick={() => setMode('light')}
			><Sun className="mr-2 size-4" /> Light</DropdownMenu.Item
		>
		<DropdownMenu.Item onclick={() => setMode('dark')}
			><Moon className="mr-2 size-4" /> Dark</DropdownMenu.Item
		>
		<DropdownMenu.Separator />
		<DropdownMenu.Item onclick={() => setMode('system')}
			><Monitor className="mr-2 size-4" /> System</DropdownMenu.Item
		>
	</DropdownMenu.Content>
</DropdownMenu.Root>
