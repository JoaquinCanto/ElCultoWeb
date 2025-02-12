import './App.css';
import { PrivateRoutes, PublicRoutes } from './models/Routes';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthGuard } from './guards/authGuard';

// import Placeholder from './components/Placeholder';
import Layout from './pages/Layout';
import Boards from './pages/Boards';
import Register from './pages/Register';
import LogIn from './pages/LogIn';
import MyBoards from './pages/MyBoards';
import ControlPanel from './pages/ControlPanel';

function App() {

	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route element={<Layout />} >
						<Route path={PublicRoutes.HOME} element={<Boards />} />
						<Route path={PublicRoutes.MESAS} element={<Boards />} />
						<Route path={PublicRoutes.REGISTRARSE} element={<Register />} />
						<Route path={PublicRoutes.INGRESAR} element={<LogIn />} />

						<Route element={<AuthGuard />}>
							<Route path={PrivateRoutes.MISMESAS} element={<MyBoards />} />
							<Route path={PrivateRoutes.ADMINISTRACION} element={<ControlPanel />} />
						</Route>
					</Route>
				</Routes>
			</BrowserRouter>
		</>
	)
}

export default App
