import { useAllGames } from "../../services/queries";
import { GameGet } from "../../types/game";
import DisplayTable from "../DisplayTable";

const GamesDetails = () => {
	const columnsGames = [
		{ key: "agregado", label: "Agregado" },
		{ key: "nombre", label: "Nombre" },
		{ key: "descripcion", label: "Descripción" },
		{ key: "habilitado", label: "Habilitado" },
		{ key: "fechaBaja", label: "Fecha de Baja" },
		{ key: "acciones", label: "Acciones" }
	]

	const gamesQuery = useAllGames();

	const dataGames = gamesQuery.data?.items.map((gameData: GameGet) => (
		{
			key: gameData.idJuego,
			agregado: gameData.agregado,
			nombre: gameData.nombre,
			descripcion: gameData.descripcion,
			habilitado: gameData.estado,
			fechaBaja: gameData.fechaBaja
		}
	)) ?? [];

	const pagesGames = gamesQuery.data !== undefined ? Math.ceil(gamesQuery.data.items.length / 10) : 0;

	return (
		<DisplayTable
			pages={pagesGames}
			columns={columnsGames}
			data={dataGames}
			actionType="game"
		/>
	)
}

export default GamesDetails