<script lang="ts">
	let { data } = $props();
	let convId = $derived(data.convId);
</script>

{convId}
