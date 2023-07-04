import Keyboard from '$lib/components/boards/Keyboard.svelte';
import { WordlePoints } from '$lib/types/WordlePoints';
import { expect, test } from '@playwright/experimental-ct-svelte';


test('keyboard is shown', async ({ mount }) => {
	const comp = await mount(Keyboard, {
		props: {
			usedLetters: {},
		},
	});

	await expect(comp).toBeVisible();
});


test('colored letters in keyboard', async ({ mount }) => {
	const comp = await mount(Keyboard, {
		props: {
			usedLetters: {
				s: { validity: WordlePoints.Exact },
				u: { validity: WordlePoints.InWord },
				n: { validity: WordlePoints.Missing },
			},
		},
	});

	const letterS = comp.getByTestId('letter_s');
	await expect(letterS).toHaveClass(/letter-perfect/);

	const letterU = comp.getByTestId('letter_u');
	await expect(letterU).toHaveClass(/letter-in-word/);

	const letterN = comp.getByTestId('letter_n');
	await expect(letterN).toHaveClass(/letter-missing/);
});

