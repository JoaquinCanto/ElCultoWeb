import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],

	server: {
		host: '0.0.0.0', // Listen on all IP addresses, making it accessible on the LAN
		port: 5174       // You can change the port number if you want
	}

})
