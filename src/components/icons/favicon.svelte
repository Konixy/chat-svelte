<script lang="ts">
	let { class: className, ...Props }: { class?: string; [propName: string]: any } = $props();
</script>

<svg
	id="Calque_1"
	data-name="Calque 1"
	xmlns="http://www.w3.org/2000/svg"
	xmlns:xlink="http://www.w3.org/1999/xlink"
	viewBox="0 0 144.5 144.5"
	class={className || '[fill:url(#logo-gradient)]'}
	{...Props}
>
	<defs>
		<!-- <style>
			.cls-1 {
				fill: url(#logo-gradient);
			}
		</style> -->
		<linearGradient
			id="logo-gradient"
			data-name="Dégradé sans nom 299"
			x1="7.88"
			y1="144.13"
			x2="122.49"
			y2="16.04"
			gradientUnits="userSpaceOnUse"
		>
			<stop offset="0" stop-color="#37b3a5" />
			<stop offset=".39" stop-color="#3794bd" />
			<stop offset=".6" stop-color="#5274ae" />
			<stop offset=".77" stop-color="#6460a5" />
			<stop offset=".89" stop-color="#6b59a2" />
		</linearGradient>
	</defs>
	<path
		d="M70.1,.28c41.7-1.22,75.72,33.05,74.09,74.84-1.5,38.78-34.08,69.13-72.89,69.13H15.13c-3.25,0-5.88-2.63-5.88-5.88v-24.88c-.3-3.95-1.15-7.74-2.49-11.29,0-.01-.01-.03-.02-.04,0-.02-.02-.05-.02-.07-.19-.4-.37-.8-.55-1.21-.31-.72-.61-1.44-.89-2.17,0-.01,0-.02,0-.02-.23-.56-.44-1.12-.65-1.69l-.02-.06C1.86,89.46,.34,81.41,.25,73-.14,34,31.11,1.42,70.1,.28Z"
	/>
</svg>
