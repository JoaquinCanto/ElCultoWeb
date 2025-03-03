import { Divider } from "@heroui/react";
import { useBoardsNarrated, usePlayerInscriptions } from "../services/queries";
import usePersonStore from "../stores/personStore";
import { InscriptionGet } from "../types/inscription";
import DisplayTable from "../components/DisplayTable";
import { BoardGet } from "../types/board";

export default function MyBoards() {

	const columnsPlayer = [
		{ key: "juego", label: "Juego", },
		{ key: "narrador", label: "Narrador", },
		{ key: "fecha", label: "Fecha", },
		{ key: "lugar", label: "Lugar", },
		{ key: "estado", label: "Estado", },
		{ key: "asistencia", label: "Asistencia", },
		{ key: "inscripto", label: "Fecha Inscripción", },
		{ key: "acciones", label: "Acciones", }
	];

	const checkAsistencia = (fechaMesa: string) => {
		const boardDate = new Date(fechaMesa);
		const now = new Date();

		if (boardDate < now) {
			return "Sin Registro";
		}
		else {
			return "Mesa Sin Ocurrir"
		}
	}

	const { id, tipo } = usePersonStore();

	const playerInscriptionQuery = usePlayerInscriptions(id);

	const dataPlayer = playerInscriptionQuery.data?.items.map((inscriptionData: InscriptionGet) => (
		{
			key: inscriptionData.idInscripcion,
			mesa: inscriptionData.idMesa,
			juego: inscriptionData.mesa.juego.nombre,
			narrador: inscriptionData.mesa.narrador.apodo,
			fecha: new Date(inscriptionData.mesa.fechaHora).toLocaleString().slice(0, 17).concat(" hs."),
			lugar: `${inscriptionData.mesa.lugar.nombre} - ${inscriptionData.mesa.lugar.direccion}`,
			estado: inscriptionData.mesa.estado,
			asistencia: inscriptionData.asistencia === null ? checkAsistencia(inscriptionData.mesa.fechaHora) : inscriptionData.asistencia,
			inscripto: new Date(inscriptionData.fechaInscripcion).toLocaleString()
		}
	)) ?? [];

	const rowsPerPage = 10;
	const pagesPlayer = playerInscriptionQuery.data !== undefined ? Math.ceil(playerInscriptionQuery.data.items.length / rowsPerPage) : 0;

	function renderTableNarrador() {
		const columnsNarrator = [
			{ key: "juego", label: "Juego", },
			{ key: "fecha", label: "Fecha", },
			{ key: "lugar", label: "Lugar", },
			{ key: "estado", label: "Estado", },
			{ key: "fechaCreacion", label: "Fecha Creacion", },
			{ key: "acciones", label: "Acciones", }
		]

		const boardsNarratedQuery = useBoardsNarrated(id);

		const dataNarrator = boardsNarratedQuery.data?.items.map((mesaData: BoardGet) => (
			{
				key: mesaData.idMesa,
				mesa: mesaData.idMesa,
				juego: mesaData.juego.nombre,
				fecha: new Date(mesaData.fechaHora).toLocaleString().slice(0, 17).concat(" hs."),
				lugar: `${mesaData.lugar.nombre} - ${mesaData.lugar.direccion}`,
				estado: mesaData.estado,
				fechaCreacion: new Date(mesaData.fechaCreacion).toLocaleString()
			}
		)) ?? [];

		const pagesNarrator = boardsNarratedQuery.data !== undefined ? Math.ceil(boardsNarratedQuery.data.items.length / rowsPerPage) : 0;


		return (
			<div className="flex flex-col gap-4">
				<p className='font-bold text-lg'>Mesas Como Narrador</p>
				<DisplayTable
					pages={pagesNarrator}
					columns={columnsNarrator}
					data={dataNarrator}
					actionType="narrator"
				/>

				<Divider />
				<p className='font-bold text-lg'>Mesas como Jugador</p>

			</div>)
	}

	return (
		<div className="flex flex-col gap-4 p-4">
			<p className='font-bold text-2xl'>Mis Mesas</p>
			{tipo !== "Jugador" &&
				renderTableNarrador()
			}
			<DisplayTable
				pages={pagesPlayer}
				columns={columnsPlayer}
				data={dataPlayer}
				actionType="player"
			/>
		</div>
	)
}
