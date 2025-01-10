import './App.css';
import { PublicRoutes } from './models/Routes';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Layout from './pages/Layout';
import Placeholder from './components/Placeholder';
import Boards from './pages/Boards';

function App() {

	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route element={<Layout />} >
						<Route path={PublicRoutes.HOME} element={<Placeholder />} />
						<Route path={PublicRoutes.MESAS} element={<Boards />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</>
	)
}

export default App
