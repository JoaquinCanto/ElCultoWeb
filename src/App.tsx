import './index.css';
import { PrivateRoutes, PublicRoutes } from './models/Routes';
import { BrowserRouter, Route, Routes } from 'react-router';
import { AuthGuard } from './guards/authGuard';

import Layout from './pages/Layout';
import Boards from './pages/Boards';
import Register from './pages/Register';
import LogIn from './pages/LogIn';
import MyBoards from './pages/MyBoards';
import ControlPanel from './pages/ControlPanel';
import Reports from './pages/Reports';
import MyProfile from './pages/MyProfile';
import WeAre from './pages/WeAre';
import Events from './pages/Events';
import FAQ from './pages/FAQ';

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
						<Route path={PublicRoutes.NOSOTROS} element={< WeAre />} />
						<Route path={PublicRoutes.EVENTOS} element={< Events />} />
						<Route path={PublicRoutes.FAQ} element={< FAQ />} />

						<Route element={<AuthGuard />}>
							<Route path={PrivateRoutes.MISMESAS} element={<MyBoards />} />
							<Route path={PrivateRoutes.ADMINISTRACION} element={<ControlPanel />} />
							<Route path={PrivateRoutes.REPORTES} element={<Reports />} />
							<Route path={PrivateRoutes.MIPERFIL} element={<MyProfile />} />
						</Route>
					</Route>
				</Routes>
			</BrowserRouter>
		</>
	)
}

export default App
