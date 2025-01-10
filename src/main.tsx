import './index.css';
import App from './App.tsx';
import * as ReactDOM from 'react-dom/client';
import { NextUIProvider } from '@nextui-org/react';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<NextUIProvider>
		<div className='dark text-foreground bg-background'>
			<App />
		</div>
	</NextUIProvider>
)
