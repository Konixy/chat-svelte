<script lang="ts">
import { ModeWatcher } from 'mode-watcher';
import '../app.css';

let { children } = $props();
</script>

<svelte:head>
	<title>Awesome svelte chat app</title>
</svelte:head>

<ModeWatcher defaultMode="dark" />

{@render children()}
