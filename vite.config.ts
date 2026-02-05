import { defineConfig, loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from "@tailwindcss/vite";
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd());
	return {
		plugins: [
			react(),
			tsconfigPaths(),
			tailwindcss()
		],

		define: {
			__APP_ENV__: JSON.stringify(env.APP_ENV),
		},

		server: {
			host: '0.0.0.0', // Listen on all IP addresses, making it accessible on the LAN
			port: 5174       // You can change the port number if you want
		},
	}
})
