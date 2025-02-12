import './index.css';
import App from './App.tsx';
import * as ReactDOM from 'react-dom/client';
import { HeroUIProvider } from "@heroui/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
	defaultOptions: { queries: { retry: 5, retryDelay: 1000 } },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
	<QueryClientProvider client={queryClient}>
		<HeroUIProvider
			locale="es-ES"
			className='dark text-foreground bg-background'
		>
			<App />
		</HeroUIProvider>
	</QueryClientProvider>
);
