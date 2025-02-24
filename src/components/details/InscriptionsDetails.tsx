import { useInscriptions } from '../../services/queries';
import { InscriptionGet } from '../../types/inscription';
import DisplayTable from '../DisplayTable';



const InscriptionsDetails = () => {
	const columnsInscriptions = [
		{ key: "juego", label: "Juego" },
		{ key: "narrador", label: "Narrador" },
		{ key: "fechaMesa", label: "Fecha de la Mesa" },
		{ key: "jugador", label: "Jugador" },
		{ key: "fechaInscripcion", label: "Fecha de Inscripción", },
		{ key: "estado", label: "Estado" },
		{ key: "acciones", label: "Acciones" }
	]

	const inscriptionsQuery = useInscriptions();
	const dataInscriptions = inscriptionsQuery.data?.items.map((inscripcionData: InscriptionGet) => (
		{
			key: inscripcionData.idInscripcion,
			mesa: inscripcionData.idMesa,
			juego: inscripcionData.mesa.juego.nombre,
			narrador: inscripcionData.mesa.narrador.apodo,
			fechaMesa: new Date(inscripcionData.mesa.fechaHora).toLocaleString().slice(0, 17).concat(" hs."),
			jugador: inscripcionData.jugador.apodo,
			fechaInscripcion: new Date(inscripcionData.fechaInscripcion).toLocaleString(),
			estado: inscripcionData.baja === true ? "Cancelada" : "Activa",
		}
	)) ?? [];

	const pagesInscriptions = inscriptionsQuery.data !== undefined ? Math.ceil(inscriptionsQuery.data.items.length / 10) : 0;

	return (
		<DisplayTable
			pages={pagesInscriptions}
			columns={columnsInscriptions}
			data={dataInscriptions}
			actionType="inscription"
		/>
	)
}

export default InscriptionsDetails