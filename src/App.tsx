import './App.css'
import Layout from './pages/Layout'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {

	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route element={<Layout />} />
				</Routes>
			</BrowserRouter>
		</>
	)
}

export default App
