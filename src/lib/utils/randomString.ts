
export function generateString(length: number): string {
	return (+new Date * Math.random()).toString(36).substring(0, length).toUpperCase();
}

export function generateRandomName(): string {
	return `${capitalize(randomAdjective())} ${randomNoun()}`;
}

function randomAdjective(): string {
	return randomInArray([
		"crazy",
		"random",
		"chaos",
		"wet",
		"dry",
		"upstanding",
	]);
}

function randomNoun(): string {
	return randomInArray([
		"squirrel",
		"mouse",
		"lion",
		"mountain",
		"lake",
	]);
}

function capitalize(word: string): string {
	return `${word.at(0)?.toUpperCase()}${word.slice(1)}`;
}

export function randomInArray<T>(array: T[]): T {
	const randomNum = Math.floor(Math.random() * (array.length - 1));

	return array[randomNum];
}
