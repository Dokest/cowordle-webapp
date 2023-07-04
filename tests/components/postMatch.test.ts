import PostMatch from '$lib/components/text/PostMatch.svelte';
import { expect, test } from '@playwright/experimental-ct-svelte';


test('post match is shown', async ({ mount }) => {
	const comp = await mount(PostMatch, {
		props: {
			isLocalWinner: true,
			isLost: false,
			solution: 'tests',
			winnerName: 'username',
			accumulatedKnowledge: [],
		},
	});

	await expect(comp).toBeVisible();
});


test('local winner shows correctly', async ({ mount }) => {
	const comp = await mount(PostMatch, {
		props: {
			isLocalWinner: true,
			isLost: false,
			solution: 'tests',
			winnerName: 'local',
			accumulatedKnowledge: [],
		},
	});

	await expect(comp).toContainText('You');
	await expect(comp).toContainText('tests');
});


test('remote winner shows correctly', async ({ mount }) => {
	const comp = await mount(PostMatch, {
		props: {
			isLocalWinner: false,
			isLost: false,
			solution: 'tests',
			winnerName: 'remote',
			accumulatedKnowledge: [],
		},
	});

	await expect(comp).toContainText('remote');
	await expect(comp).toContainText('tests');
});
