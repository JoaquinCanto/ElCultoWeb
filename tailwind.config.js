const { heroui } = require("@heroui/react")
/** @type {import('tailwindcss').Config} */

export default {
	content: [
    "./index.html",
    "./src/**/*.js",
    "./src/**/*.ts",
    "./src/**/*.jsx",
    "./src/**/*.tsx",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
	],
	theme: {
		extend: {},
	},
	darkMode: 'class',
	plugins: [heroui({
		themes: {
			dark: {
				colors: {
					primary: {
						DEFAULT: '#9234eb',
						foreground: '#000000',
					},
					secondary: {
						DEFAULT: '#3437eb',
						foreground: '#000000',
					},
				},
			},
		},
	})],
}
