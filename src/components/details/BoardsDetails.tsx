import DisplayTable from '../DisplayTable';
import { useBoards } from '../../services/queries';
import { BoardGet } from '../../types/board';

const BoardsDetails = () => {
	const columnsBoards = [
		{ key: "juego", label: "Juego" },
		{ key: "narrador", label: "Narrador" },
		{ key: "fecha", label: "Fecha" },
		{ key: "lugar", label: "Lugar" },
		{ key: "estado", label: "Estado" },
		{ key: "cupoMin", label: "Cupo Mínimo" },
		{ key: "cupoMax", label: "Cupo Máximo" },
		{ key: "notas", label: "Notas" },
		{ key: "jugadores", label: "Jugadores" },
		{ key: "publica", label: "¿Mesa Publica?" },
		{ key: "codigo", label: "Código" },
		{ key: "fechaCreacion", label: "Fecha Creacion", },
		{ key: "acciones", label: "Acciones" }
	]

	const boardsQuery = useBoards();

	const dataBoards = boardsQuery.data?.items.map((mesaData: BoardGet) => (
		{
			key: mesaData.idMesa,
			mesa: mesaData.idMesa,
			juego: mesaData.juego.nombre,
			narrador: mesaData.narrador.apodo,
			fecha: new Date(mesaData.fechaHora).toLocaleString().slice(0, 17).concat(" hs."),
			lugar: `${mesaData.lugar.nombre} - ${mesaData.lugar.direccion}`,
			estado: mesaData.estado,
			cupoMin: mesaData.cupoMin,
			cupoMax: mesaData.cupoMax,
			notas: mesaData.notas,
			jugadores: mesaData.jugadores.map((jugador: any) => jugador.jugador.apodo),
			publica: mesaData.publica === true ? "Si" : "No",
			codigo: mesaData.codigo === null ? "Sin Código" : mesaData.codigo,
			fechaCreacion: new Date(mesaData.fechaCreacion).toLocaleString()
		}
	)) ?? [];

	const pagesBoards = boardsQuery.data !== undefined ? Math.ceil(boardsQuery.data.items.length / 10) : 0;

	return (
		<DisplayTable
			pages={pagesBoards}
			columns={columnsBoards}
			data={dataBoards}
			actionType="board"
		/>
	)
}

export default BoardsDetails