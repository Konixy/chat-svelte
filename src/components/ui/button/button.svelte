<script lang="ts" module>
import type { WithElementRef } from 'bits-ui';
import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
import { type VariantProps, tv } from 'tailwind-variants';

export const buttonVariants = tv({
	base: 'ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
	variants: {
		variant: {
			default: 'bg-primary text-primary-foreground hover:bg-primary/90',
			destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
			outline: 'border-input bg-background hover:bg-accent hover:text-accent-foreground border',
			secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
			ghost: 'hover:bg-accent hover:text-accent-foreground',
			link: 'text-primary underline-offset-4 hover:underline',
			glow: 'border-input bg-background hover:bg-accent hover:text-accent-foreground border'
		},
		size: {
			default: 'h-10 px-4 py-2',
			sm: 'h-9 rounded-md px-3',
			lg: 'h-11 rounded-md px-8',
			icon: 'size-9 text-lg'
		}
	},
	defaultVariants: {
		variant: 'default',
		size: 'default'
	}
});

export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
export type ButtonSize = VariantProps<typeof buttonVariants>['size'];

export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
	WithElementRef<HTMLAnchorAttributes> & {
		contentClass?: string;
		variant?: ButtonVariant;
		size?: ButtonSize;
		loading?: boolean;
	};
</script>

<script lang="ts">
import { cn } from '@/lib/utils.js';
import { Loader2 as Loader } from 'lucide-svelte';

let {
	class: className,
	contentClass: contentClassName,
	variant = 'default',
	size = 'default',
	ref = $bindable(null),
	href = undefined,
	type = 'button',
	loading = $bindable(false),
	children,
	...restProps
}: ButtonProps = $props();
</script>

{#if href}
	<a
		bind:this={ref}
		class="{cn(buttonVariants({ variant, size }), className)} {loading
			? 'pointer-events-none opacity-50 [&_.btn-content]:opacity-0 [&_.loader]:block'
			: ''}"
		{href}
		{...restProps}
	>
		<span class="btn-content {contentClassName}">{@render children?.()}</span>
		<div class="loader absolute hidden animate-spin"><Loader class="size-5!" /></div>
	</a>
{:else}
	<button
		bind:this={ref}
		disabled={loading}
		class="{cn(buttonVariants({ variant, size }), className)} {loading
			? '[&_.btn-content]:opacity-0 [&_.loader]:block'
			: ''}"
		{type}
		{...restProps}
	>
		<span class="btn-content {contentClassName}">{@render children?.()}</span>
		<div class="loader absolute hidden animate-spin"><Loader class="size-5!" /></div>
	</button>
{/if}
