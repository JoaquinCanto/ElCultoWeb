import axios from "axios";
import Game from "../components/Game";
import { useEffect, useState } from "react";

interface BoardsTypes {
	idMesa: number,
	juego: any,
	narrador: any,
	fechaHora: string,
	lugar: any,
	descripcion: any,
	notas: string,
	cupoMin: number,
	cupoMax: number
	jugadores: any
}

export default function Boards() {

	const [boards, setBoards] = useState([]);

	const fetchBoards = async () => {
		axios
			.get("http://localhost:3000/mesa/abierta")
			.then((response) => {
				setBoards(response.data.items);
				console.log(response.data.items);
			})
			.catch((error) => {
				console.error('Error fetching data:', error);
			});
	};

	useEffect(() => {
		fetchBoards();
	}, [])

	const renderBoards = () => {
		return boards.map((board: BoardsTypes) => (
			<Game
				key={board.idMesa}
				idMesa={board.idMesa}
				juego={board.juego.nombre}
				narrador={board.narrador.apodo}
				fecha={board.fechaHora}
				lugar={board.lugar.nombre}
				descripcion={board.juego.descripcion}
				notas={board.notas}
				minJugadores={board.cupoMin}
				maxJugadores={board.cupoMax}
				cantJugadores={board.jugadores.length}
			/>
		))
	}


	return (
		<div className='h-full p-4 flex flex-wrap gap-4'>
			{boards.length < 1 ?
				<p>No hay mesas disponibles</p> :
				renderBoards()}
		</div>
	)
}
