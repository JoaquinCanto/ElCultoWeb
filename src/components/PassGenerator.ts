export default function PassGenerator() {
	const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const numbers = "0123456789";

	// Generate 3 random letters
	const randomLetters = Array.from({ length: 3 }, () =>
		letters.charAt(Math.floor(Math.random() * letters.length))
	).join("");

	// Generate 2 random numbers
	const randomNumbers = Array.from({ length: 2 }, () =>
		numbers.charAt(Math.floor(Math.random() * numbers.length))
	).join("");

	// Combine and shuffle
	const combined = (randomLetters + randomNumbers).split("");
	const shuffled = combined.sort(() => 0.5 - Math.random()).join("");

	return shuffled;
};

