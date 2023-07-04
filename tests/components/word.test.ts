import Word from '$lib/components/prefrabs/Word.svelte';
import { WordlePoints } from '$lib/types/WordlePoints';
import { expect, test } from '@playwright/experimental-ct-svelte';


test('component is displayed correctly', async ({ mount }) => {
	const comp = await mount(Word, {
		props: {
			word: 'Hello',
			length: 'Hello'.length,
		},
	});

	await expect(comp).toBeVisible();
});


test('contents are displayed correctly', async ({ mount }) => {
	const comp = await mount(Word, {
		props: {
			word: 'Hello',
			length: 'Hello'.length,
		},
	});

	await expect(comp).toContainText('Hello');
});


test('colors are shown correctly', async ({ mount }) => {
	const word = 'SUN';

	const comp = await mount(Word, {
		props: {
			word,
			length: word.length,
			results: [WordlePoints.Exact, WordlePoints.InWord, WordlePoints.Missing]
		},
	});

	const innerLetters = await comp.getByRole('paragraph').all();

	await expect(innerLetters[0]).toHaveClass(/letter-exact/);
	await expect(innerLetters[1]).toHaveClass(/letter-in-word/);
	await expect(innerLetters[2]).toHaveClass(/letter-missing/);
});
