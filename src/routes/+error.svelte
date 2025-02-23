<script lang="ts">
import { page } from '$app/state';
</script>

<div class="container">
	<div class="status">{page.status}</div>
	{#if page.error}
		<div class="message">{page.error.message || 'Error'}</div>
	{/if}
	<a href="/" class="button transition">Return to homepage</a>
</div>

<style>
.container {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100vh;
	gap: 1rem;
	margin-left: auto;
	margin-right: auto;
}

.status {
	font-weight: 900;
	font-size: 150px;
	color: hsl(var(--primary));
}

.message {
	font-weight: 600;
	font-size: 38px;
	margin-top: -40px;
	color: hsl(var(--muted-foreground));
}

.button {
	margin-top: 20px;
	background-color: hsl(var(--foreground) / 0.8);
	border-radius: calc(infinity * 1px);
	padding-block: calc(var(--spacing) * 2);
	padding-inline: calc(var(--spacing) * 4);
	color: hsl(var(--background));
	cursor: pointer;
	transition: 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

.button:hover {
	background-color: hsl(var(--foreground));
}

@media (width <= 40rem) {
	.status {
		font-size: 125px;
	}

	.message {
		font-size: 30px;
		margin-top: -30px;
	}
}
</style>
