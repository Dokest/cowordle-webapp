import { expect, test, type Locator, type Page } from '@playwright/test';

test('fast-flow', async ({ page }) => {
	page.on('console', (msg) => {
		console.log(msg);
	});

	await page.goto('/');

	const hostButton = page.locator('#host_button');

	await expect(hostButton).toBeEnabled();

	await hostButton.click();

	await page.waitForURL(/\/room\/[A-Z0-9]{6}/);

	const startGameButton = page.getByTitle('Start the game!');

	await expect(startGameButton).toBeEnabled();

	await startGameButton.click();

	const body = page.locator('body');
	const solution = await getRealSolution(page);
	const wrongTry = getWrongTry(solution);

	await pressWord(body, wrongTry);
	await page.keyboard.down('Enter');

	expect(await page.locator('#word_0').textContent()).toBe(wrongTry);

	await pressWord(body, solution);
	await body.press('Enter');

	expect(await page.locator('#word_1').textContent()).toBe(solution);
});


async function pressWord(locator: Locator, word: string): Promise<void> {
	for await (const letter of word) {
		await locator.press(letter);
	}
}


async function getRealSolution(page: Page): Promise<string> {
	const url = page.url();
	const roomCode = url.split('/').at(-1);

	const wsServerUrl = url.replace(/:[0-9]{4}.*/, ':9000/testing/solution');

	const response = await fetch(wsServerUrl, {
		method: 'POST',
		body: JSON.stringify({ roomCode }),
	});

	const { solution } = await response.json();

	return (solution as string).toUpperCase().trim();
}


function getWrongTry(solution: string): string {
	let wrongTry: string = 'BEANS';

	if (solution === 'BEANS') {
		wrongTry = 'CHILD';
	}

	return wrongTry;
}
