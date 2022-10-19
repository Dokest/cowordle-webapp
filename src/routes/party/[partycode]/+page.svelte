<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	const partyCode: string = $page.params['partycode'];

	if (!partyCode) {
		goto('/error?e=missing-partycode');
	}

	console.log(partyCode);
</script>

HELLO PARTY Party Code = "{partyCode}"
