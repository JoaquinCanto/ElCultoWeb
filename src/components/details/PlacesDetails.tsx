import { useAllPlaces } from "../../services/queries";
import { PlaceGet } from "../../types/place";
import DisplayTable from "../DisplayTable"


const PlacesDetails = () => {
	const columnsPlaces = [
		{ key: "agregado", label: "Agregado" },
		{ key: "nombre", label: "Nombre" },
		{ key: "direccion", label: "Dirección" },
		{ key: "habilitado", label: "Habilitado" },
		{ key: "fechaBaja", label: "Fecha de Baja" },
		{ key: "acciones", label: "Acciones" }
	]

	const placesQuery = useAllPlaces();

	const dataPlaces = placesQuery.data?.items.map((placeData: PlaceGet) => (
		{
			key: placeData.idLugar,
			agregado: placeData.agregado,
			nombre: placeData.nombre,
			direccion: placeData.direccion,
			habilitado: placeData.estado,
			fechaBaja: placeData.fechaBaja,
		}
	)) ?? [];

	const pagesPlaces = placesQuery.data !== undefined ? Math.ceil(placesQuery.data.items.length / 10) : 0;

	return (
		<DisplayTable
			pages={pagesPlaces}
			columns={columnsPlaces}
			data={dataPlaces}
			actionType="place"
		/>
	)
}

export default PlacesDetails