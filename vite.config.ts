import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
	const env = loadEnv(mode, process.cwd());
	return {
		plugins: [react()],

		define: {
			__APP_ENV__: JSON.stringify(env.APP_ENV),
		},

		server: {
			host: '0.0.0.0', // Listen on all IP addresses, making it accessible on the LAN
			port: 5174       // You can change the port number if you want
		},
	}
})
